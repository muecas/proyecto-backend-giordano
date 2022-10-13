import { PathLike } from 'fs';
import Container from "../Container/Container";
import config  from "../../config/config";

// Products type
type Product = {
	[key: string]: number | String | PathLike | undefined,
	id?: number,
	timestamp?: number,
	name?: String,
	description?: String,
	sku?: String,
	price?: number,
	stock?: number,
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
	
	// Products keys
	private maxId: number = 0;
	
	// Products array
	private products: Array<Product> = [];
	
	// Filesystem file loaded flag
	private loaded: boolean = false;
	
	/**
	 * Constructor
	 */
	
	constructor() {
		
		// Super constructor
		super(`${config.DATA_STORAGE}/products.json`);
		
	}
	
	/**
	 * Saves a new product to the products storage
	 * @param {Product} product
	 * @return {Product | ValidationResult}
	 */
	
	async create(product: Product): Promise<ValidationResult | Product> {
		
		// Await for the products to load
		await this.verifyLoaded();
		
		// Validate the product
		const validation: ValidationResult = this.validateProduct(product);
		
		// If any error ocurred
		if(validation.errors.length > 0) return validation;
		
		// Sets the new id
		const id: number = ++this.maxId;
		
		// New product to add
		const record: Product = { id, timestamp : Date.now(), ...product };
		
		// Sets the product
		this.products.push(record);
		
		// Sets the product
		await this.save(this.products);
		
		// (:
		return record;
		
	}
	
	/**
	 * Updates a product
	 * @param {number}  id
	 * @param {Product} product
	 * @return {Product | ValidationResult | false}
	 */
	
	async update(id: number, product: Product): Promise<Product | ValidationResult | false> {
		
		// Await for the products to load
		await this.verifyLoaded();
		
		// Gets the product index
		const index: number = this.getIndex(id);
		
		// ):
		if(index < 0) return false;
		
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
		
		// Sets the product
		this.products[index] = { ...this.products[index], ...update };
		
		// Sets the product
		await this.save(this.products);
		
		// (:
		return this.products[index];
		
	}
	
	/**
	 * Gets a product by id
	 * @param {number} id
	 * @return {Product | false}
	 */
	
	async get(id: number): Promise<Product | boolean> {
		
		// Await for the products to load
		await this.verifyLoaded();
		
		// (:
		return this.products.filter((product: Product) => product.id === id)[0] || false;
		
	}
	
	/**
	 * Gets a product index by id
	 * @param {number} id
	 * @return {number}
	 */
	
	getIndex(id: number): number {
		
		// (:
		return this.products.findIndex((product: Product) => Number(product.id) === id);
		
	}
	
	/**
	 * Gets all products
	 * @param {number} id
	 * @return {Array<Product>}
	 */
	
	async all(): Promise<Array<Product>> {
		
		// Await for the products to load
		await this.verifyLoaded();
		
		// (:
		return this.products;
		
	}
	
	/**
	 * Deletes a product by id
	 * @param {number} id
	 * @return {boolean}
	 */
	
	async delete(id: number): Promise<boolean> {
		
		// Await for the products to load
		await this.verifyLoaded();
		
		// Gets the product index
		const index: number = this.getIndex(id);
		
		// ):
		if(index < 0) return false;
		
		// Removes the product from the product array
		this.products.splice(index, 1);
		
		// Sets the product
		await this.save(this.products);
		
		// ( :
		return true;
		
	}
	
	/**
	 * Check the products have been loaded from the filesystem
	 * @private
	 */
	
	private async verifyLoaded() {
		
		// If the products have not been loaded
		if(this.loaded === false) {
			
			// Set the products
			await this.getAll().then(products => {
				this.products = products;
				this.maxId = this.products[this.products.length - 1]?.id || 0;
			});
			
			// Sets the products as loaded
			this.loaded = true;
			
		}
		
	}
	
	/**
	 * Validates a product
	 * @param {Product} product
	 * @return {ValidationResult}
	 */
	
	validateProduct(product: Product): ValidationResult {
		
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
				field     : 'description',
				validator : (value: any): boolean => {
					return value !== null && value !== '';
				},
				message   : 'El campo <description> es obligatorio'
			},
			{
				field     : 'sku',
				validator : (value: any): boolean => {
					return value !== null && value !== '';
				},
				message   : 'El campo <sku> es obligatorio'
			},
			{
				field     : 'price',
				validator : (value: any): boolean => {
					return !isNaN(parseInt(value)) && Number(value) >= 0;
				},
				message   : 'El campo <price> es obligatorio y debe ser un valor numérico'
			},
			{
				field     : 'stock',
				validator : (value: any): boolean => {
					return !isNaN(parseInt(value)) && Number(value) >= 0;
				},
				message   : 'El campo <stock> es obligatorio y debe ser un valor numérico'
			},
			{
				field     : 'thumbnail',
				validator : (value: any): boolean => {
					return value !== null && value !== '';
				},
				message   : 'El campo <thumbnail> es obligatorio'
			}
		]
		.map(({ field, validator, message }: { field: string, validator: Function, message: string }): Validation => validator.call(null, product[field] || null) === false ? { field, message, valid : false } : { field, valid : true });
		
		// (:
		return {
			valid  : results.filter((validation: Validation) => validation.valid === true),
			errors : results.filter((validation: Validation) => validation.valid === false)
		};
		
	}
	
}

export { Product, Validation, ValidationResult, isValidationResult };
export default Products;