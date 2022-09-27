import { PathLike } from 'fs'

// Products type
type Product = {
	id?: number,
	title?: String,
	price?: number,
	thumbnail?: PathLike
};

// Validation result type
type ValidationResult = {
	valid?: Array<Validation>,
	errors?: Array<Validation>
};

// Validation type
type Validation = {
	field: String,
	message?: String,
	valid: boolean
};

/**
 * Products class
 * @class
 */

class Products {
	
	// Products keys
	private maxId: number = 0;
	
	// Products array
	private products: Array<Product>;
	
	/**
	 * Constructor
	 * @param {Array<Product>} products
	 */
	
	constructor(products: Array<Product> = []) {
		
		// Set the products
		this.products = products;
		
	}
	
	/**
	 * Saves a new product to the products array
	 * @param {Product} product
	 * @return {number | Array<Validation>}
	 */
	
	create(product: Product): Product | ValidationResult {
		
		// Validate the product
		const validation: ValidationResult = this.validateProduct(product);
		
		// If any error ocurred
		if(validation.errors.length > 0) return validation;
		
		// Sets the new id
		const id: number = ++this.maxId;
		
		// New product to add
		const record: Product = { id, ...product };
		
		// Sets the product
		this.products.push(record);
		
		// (:
		return record;
		
	}
	
	/**
	 * Updates a product
	 * @param {number}  id
	 * @param {Product} product
	 * @return {Product | boolean}
	 */
	
	update(id: number, product: Product): Product | ValidationResult | boolean {
		
		// Gets the product index
		const index: number = this.getIndexById(id);
		
		// ):
		if(index < 0) return false;
		
		// Validates the product
		const validation: ValidationResult = this.validateProduct(product);
		
		// If any error ocurred
		if(!validation.valid || validation.valid.length === 0) return validation;
		
		// Sets the fields to update
		const update: Product = {};
		
		// Gets the fields to update
		validation.valid.map((valid: Validation) => {
			update[String(valid.field)] = product[String(valid.field)];
		});
		
		// Sets the product
		this.products[index] = { ...this.products[index], ...update };
		
		// (:
		return this.products[index];
		
	}
	
	/**
	 * Gets a product by id
	 * @param {number} id
	 * @return {Product|boolean}
	 */
	
	getById(id: number): Product | boolean {
		
		// (:
		return this.products.filter((product: Product) => product.id === id)[0] || false;
		
	}
	
	/**
	 * Gets a product index by id
	 * @param {number} id
	 * @return {number}
	 */
	
	getIndexById(id: number): number {
		
		// (:
		return this.products.findIndex((product: Product) => product.id === id);
		
	}
	
	/**
	 * Gets all products
	 * @param {number} id
	 * @return {Array<Product>}
	 */
	
	getAll(): Array<Product> {
		
		// (:
		return this.products;
		
	}
	
	/**
	 * Deletes a product by id
	 * @param {number} id
	 * @return {boolean}
	 */
	
	deleteById(id: number): boolean {
		
		// Gets the product index
		const index: number = this.getIndexById(id);
		
		// ):
		if(index < 0) return false;
		
		// Removes the product from the product array
		this.products.splice(index, 1);
		
		// ( :
		return true;
		
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
				field     : 'title',
				validator : (value: any): boolean => {
					return value !== null && value !== '';
				},
				message   : 'el campo <title> es obligatorio'
			},
			{
				field     : 'price',
				validator : (value: any): boolean => {
					return !isNaN(parseInt(value));
				},
				message   : 'el campo <price> es obligatorio y debe ser un valor numérico'
			},
			{
				field     : 'thumbnail',
				validator : (value: any): boolean => {
					return value !== null && value !== '';
				},
				message   : 'el campo <thumbnail> es obligatorio'
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

export { Product, Validation, ValidationResult };
export default Products;