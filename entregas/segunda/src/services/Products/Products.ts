import { PathLike } from 'fs';
import { Container } from "../../data-access/data-access";
import { ConnectionConfig } from "../../config/ConnectionConfig";

// Products type
type Product = {
	[key: string]: number | String | PathLike | undefined,
	id?: number | String,
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
 * @param test {Product|ValidationResult|boolen}
 * @return boolean
 */

function isValidationResult(test: Product | ValidationResult | boolean): boolean {
	return test !== false && (test as ValidationResult).errors !== undefined;
}

/**
 * Products class
 * @class
 */

class Products extends Container {
	
	readonly aggregationFields: object = {
		$project : {
			_id       : 0,
			id        : '$_id',
			name      : 1,
			price     : 1,
			thumbnail : 1
		}
	};
	
	/**
	 * Constructor
	 * @param {ConnectionConfig} config
	 */
	
	constructor(config: ConnectionConfig) {
		
		// Super constructor
		super(config, 'products');
		
	}
	
	/**
	 * Saves a new product to the products storage
	 * @param {Product} product
	 * @return {Product|ValidationResult|boolean}
	 */
	
	async create(product: Product): Promise<ValidationResult | Product | boolean> {
		
		// Validate the product
		const validation: ValidationResult = this.validateProduct(product);
		
		// If any error ocurred
		if(validation.errors.length > 0) return validation;
		
		// Sets the product
		const result = await this.insert(product);
		
		// (:
		return result !== false ? { id : result, ...product } : false;
		
	}
	
	/**
	 * Updates a product
	 * @param {*}       id
	 * @param {Product} product
	 * @return {Product|ValidationResult|false}
	 */
	
	async edit(id: any, product: Product): Promise<Product | ValidationResult | boolean | null> {
		
		// Gets the product by id
		const record: object | null = await this.get(id);
		
		// ):
		if(record === null) return null;
		
		// Validates the product
		const validation: ValidationResult = this.validateProduct(product);
		
		// If any error ocurred
		if(validation.valid.length === 0) return validation;
		
		// Sets the fields to update
		const update: Product = {};
		
		// Gets the fields to update
		validation.valid.map((valid: Validation) => {
			update[String(valid.field)] = product[String(valid.field)];
		});
		
		// Updates the product
		const result = await super.update(id, { ...update });
		
		// (:
		return result === true ? product : false;
		
	}
	
	/**
	 * Deletes a product
	 * @param {*} id
	 * @return {boolean | null}
	 */
	
	async remove(id: any): Promise<boolean | null> {
		
		// Gets the product index
		const record: object | null = await this.get(id);
		
		// ):
		if(record === null) return null;
		
		// (:
		return await super.delete(id);
		
	}
	
	/**
	 * Gets a product by id
	 * @param {*} id
	 * @return {Product|boolean}
	 */
	
	async get(id: any): Promise<object | null> {
		
		// Gets the product
		return await super.get(id);
		
	}
	
	/**
	 * Gets all records
	 * @param {Number} id
	 * @return {Array|boolean}
	 */
	
	async getAll(): Promise<Array<object>> {
		
		// Get all products
		return await super.getAll();
		
	}
	
	/**
	 * Validates a product
	 * @param {Product} product
	 * @return {ValidationResult}
	 */
	
	validateProduct(data: Product): ValidationResult {
		
		// Validate the passed product
		const results: Array<Validation> =
			[
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