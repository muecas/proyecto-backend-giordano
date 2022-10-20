import { PathLike } from 'fs';
import Container from "../Container/Container";
import { Knex } from "knex";
import CreateTableBuilder = Knex.CreateTableBuilder;

// Products type
type Product = {
	[key: string]: number | String | PathLike | undefined,
	id?: number,
	name?: String,
	price?: number,
	thumbnail?: PathLike
};

// Validation type
type Validation = {
	[key: string]: String | boolean | undefined,
	field: String,
	message?: String,
	valid: boolean
};

// Validation result type
type ValidationResult = {
	[key: string]: Array<Validation>,
	valid: Array<Validation>,
	errors: Array<Validation>
};

/**
 * ValidationResult validation
 * @param test {Product | ValidationResult}
 * @return boolean
 */

function isValidationResult(test: Product | ValidationResult): boolean {
	return (test as ValidationResult).errors !== undefined;
}

/**
 * Products class
 * @class
 */

class Products extends Container {
	
	private tableCreated: boolean = false;
	
	/**
	 * Constructor
	 * @param {Object} config
	 */
	
	constructor(config: object) {
		
		// Super constructor
		super(config, 'products');
		
	}
	
	/**
	 * Saves a new product to the products storage
	 * @param {Product} product
	 * @return {Product | ValidationResult}
	 */
	
	async create(product: Product): Promise<ValidationResult | Product | boolean> {
		
		// Checks if the table has been created
		await this.checkTable();
		
		// Validate the product
		const validation: ValidationResult = this.validateProduct(product);
		
		// If any error ocurred
		if(validation.errors.length > 0) return validation;
		
		// Sets the product
		const result = await this.store([{ ...product }]);
		
		// (:
		return result === true ? product : false;
		
	}
	
	/**
	 * Gets all records
	 * @param {Number} id
	 * @return {Array|boolean}
	 */
	
	async getAll(): Promise<Array<any> | boolean> {
		
		// Checks if the table has been created
		await this.checkTable();
		
		// (:
		return await super.getAll();
		
	}
	
	/**
	 * Check if the table was created
	 * @return {Promise<boolean>}
	 */
	
	async checkTable(): Promise<boolean> {
		
		// If the table has already been created
		if(this.tableCreated === false) {
		
			// Table exists
			const exists: boolean = await this.connection.schema.hasTable(this.tableName);
			
			// If the table has not been created
			if(exists === false) {
				
				// Creates the table
				await
					this.createTable((table: CreateTableBuilder): void => {
						table.increments('id');
						table.string('name', 255);
						table.float('price')
						table.text('thumbnail');
					})
					.then(() => {
						this.tableCreated = true;
						return true;
					})
					.catch(err => {
						console.log(err);
						return false;
					});
				
			}
		
		}
		
		// (:
		return true;
		
	}
	
	/**
	 * Validates a product
	 * @param {Product} product
	 * @return {ValidationResult}
	 */
	
	validateProduct(data: Product): ValidationResult {
		
		// Validate the passed product
		const results: Array<Validation> = [
			{
				field     : 'name',
				validator : (value: any): boolean => {
					return value !== null && value !== '';
				},
				message   : 'El campo <name> es obligatorio'
			},
			{
				field     : 'price',
				validator : (value: any): boolean => {
					return !isNaN(parseInt(value)) && Number(value) >= 0;
				},
				message   : 'El campo <price> es obligatorio y debe ser un valor numérico'
			},
			{
				field     : 'thumbnail',
				validator : (value: any): boolean => {
					return value !== null && value !== '';
				},
				message   : 'El campo <thumbnail> es obligatorio'
			}
		]
			.map(({ field, validator, message }: { field: string, validator: Function, message: string }): Validation => validator.call(null, data[field] || null) === false ? { field, message, valid : false } : { field, valid : true });
		
		// (:
		return {
			valid  : results.filter((validation: Validation) => validation.valid === true),
			errors : results.filter((validation: Validation) => validation.valid === false)
		};
		
	}
	
}

export { Product, Validation, ValidationResult, isValidationResult };
export default Products;