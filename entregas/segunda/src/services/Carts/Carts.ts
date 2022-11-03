import { Container } from "../../data-access/data-access";
import Products, { Product } from "../Products/Products";
import { ConnectionConfig } from "../../config/ConnectionConfig";
import firebase from "firebase/compat";
import Promotion = firebase.analytics.Promotion;

// Cart type
type Cart = {
	[key: string]: number | Array<Product> | undefined,
	id?: any,
	timestamp?: number | undefined,
	products: Array<CartProduct>
};

// Cart products type
type CartProduct = Product & {
	amount: number
};

/**
 * Carts class
 * @class
 */

class Carts extends Container {
	
	private readonly products: Products;
	readonly aggregationFields: object = {
		$project : {
			_id       : 0,
			id        : '$_id',
			timestamp : 1,
			products  : 1
		}
	};
	
	/**
	 * Constructor
	 * @param {ConnectionConfig} config
	 */
	
	constructor(config: ConnectionConfig) {
		
		// Super constructor
		super(config, 'carts');
		
		// Initializes the products instance
		this.products = new Products(config);
		
	}
	
	/**
	 * Creates a new cart
	 * @return {Cart|boolean}
	 */
	
	async create(): Promise<Cart | boolean> {
		
		// New cart to add
		const record: Cart = { timestamp : Date.now(), products : [] };
		
		// Sets the cart
		const result = await this.insert(record);
		
		/// (:
		return result !== false ? { id : result, ...record } : false;
		
	}
	
	/**
	 * Add products to existing cart or creates a new one
	 * @param {*}      id
	 * @param {Array}  products
	 * @return {Cart|null}
	 */
	
	async addToCart(id: any, products: Array<CartProduct>): Promise<Cart | null | boolean> {
		
		// Gets the cart by id
		const record: object | null = await this.get(id);
		
		// ):
		if(record === null) return null;
		
		// Filtered products
		let filteredProducts: Array<CartProduct> = [];
		
		// While index
		let index = 0;
		
		// While there are any products to check
		while(index < products.length) {
			
			// Gets the product by id
			const product = await this.products.get(products[index].id).then(result => result);
			
			// If the products exists
			if(product !== null) {
				
				// Check if the product already exists in the cart
				const productIndex = (record as Cart).products.findIndex(({ id }) => String(id) === String((product as Product).id));
				
				// If the product already exists in the cart
				if(productIndex >= 0) {
					
					// Sets the new product amount
					(record as Cart).products[productIndex].amount += products[index].amount;
					
				} else {
					
					// Pushes the product to the new products array
					filteredProducts.push({...product, amount: products[index]?.amount || 1});
					
				}
				
			}
			
			// Next!
			index = index + 1;
			
		}
		
		// If there are any new products to add
		if(filteredProducts.length > 0) {
			
			// Sets the record
			filteredProducts = ([] as Array<CartProduct>).concat((record as Cart).products, filteredProducts);
			filteredProducts = filteredProducts.filter((value, index) => filteredProducts.indexOf(value) === index);
			
		}
		
		// Sets the cart
		const cart: Cart = { products : filteredProducts.length > 0 ? filteredProducts : (record as Cart).products };
		
		// Stores the cart
		const result = await this.update(id, { ...cart })
		
		// (:
		return result !== false ? cart : false;
		
	}
	
	/**
	 * Add products to existing cart or creates a new one
	 * @param {*} id
	 * @param {*} productId
	 * @return {Cart|boolean|null}
	 */
	
	async removeFromCart(id: any, productId: any): Promise<Cart | boolean | null> {
		
		// Gets the cart by id
		const record: object | null = await this.get(id);
		
		// ):
		if(record === null) return null;
		
		// Product index
		const productIndex = (record as Cart).products.findIndex((product: CartProduct) => String(product.id) === String(productId));
		
		// If the product is in the cart
		if(productIndex >= 0) {
			
			// Removed the product from the cart
			(record as Cart).products.splice(productIndex, 1);
			
			// Sets the cart
			const cart: Cart = { products : (record as Cart).products };
			
			// Sets the cart
			await this.update(id, { ...cart });
			
			// (:
			return cart;
			
		}
		
		// (:
		return record as Cart;
		
	}
	
	/**
	 * Creates the record
	 * @param {Object} data
	 * @return {Promise<boolean>}
	 */
	
	async insert(data: Object): Promise<any | boolean> {
		
		// (:
		return await super.insert(this.encode(data));
		
	}
	
	/**
	 * Updated the record
	 * @param {*}      id
	 * @param {Object} data
	 * @return {Promise<boolean>}
	 */
	
	async update(id: any, data: object): Promise<boolean> {
		
		// (:
		return await super.update(id, this.encode(data));
		
	}
	
	/**
	 * Encodes the data to store
	 * @param {object} data
	 * @return {object}
	 */
	
	encode(data: object): object {
		
		// Depending on the DB engine
		switch(process.env.DB_ENGINE) {
			
			// MySQL/SQLite3
			case 'mysql':
			case 'sqlite3':
				(data as { products: Array<any> | String }).products = JSON.stringify((data as Cart).products);
				break;
			
		}
		
		// (:
		return data;
		
	}
	
	/**
	 * Gets a cart by id
	 * @param {*} id
	 * @return {object|null}
	 */
	
	async get(id: any): Promise<object | null> {
		
		// Gets the product
		return await super.get(id)
			.then((response: object) => {
				if(response !== null) (response as { products: Array<any> | String }).products = JSON.parse((response as { products: string }).products);
				return response;
			});
		
	}
	
	/**
	 * Deletes a product
	 * @param {*} id
	 * @return {boolean|null}
	 */
	
	async remove(id: any): Promise<boolean | null> {
		
		// Gets the product index
		const record: object | null = await this.get(id);
		
		// ):
		if(record === null) return null;
		
		// (:
		return await super.delete(id);
		
	}
	
}

export { Cart, CartProduct };
export default Carts;