import Container from "../Container/Container";
import config  from "../../config/config";
import Products, { Product } from "../Products/Products";

// Cart type
type Cart = {
	[key: string]: number | Array<Product>,
	id: number,
	timestamp: number,
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
	
	// Products keys
	private maxId: number = 0;
	
	// Carts array
	private carts: Array<Cart> = [];
	
	// Filesystem file loaded flag
	private loaded: boolean = false;
	
	/**
	 * Constructor
	 */
	
	constructor() {
		
		// Super constructor
		super(`${config.DATA_STORAGE}/carts.json`);
		
	}
	
	/**
	 * Creates a new cart
	 * @return {Cart}
	 */
	
	async create(): Promise<Cart> {
		
		// Await for the products to load
		await this.verifyLoaded();
		
		// Sets the new id
		const id: number = ++this.maxId;
		
		// New cart to add
		const record: Cart = { id, timestamp : Date.now(), products : [] };
		
		// Sets the cart
		this.carts.push(record);
		
		// Sets the cart
		await this.save(this.carts);
		
		// (:
		return record;
		
	}
	
	/**
	 * Add products to existing cart or creates a new one
	 * @param {number} id
	 * @param {Array}  products
	 * @return {Cart | boolean}
	 */
	
	async addToCart(id: number, products: Array<CartProduct>): Promise<Cart | boolean> {
		
		// Await for the products to load
		await this.verifyLoaded();
		
		// Gets the cart index
		const index: number = this.getIndex(id);
		
		// If the cart does not exist
		if(index < 0) return false;
		
		// Cart
		const cart: Cart = this.carts[index];
		
		// Gets te products storage
		const storage = new Products();
		
		// Get all the products and products ids
		const availableProducts: Array<Product> = await storage.all().then(products => products);
		const ids: Array<number> = availableProducts.map((product: Product) => Number(product.id));
		
		// For each product to add
		products.forEach((product: CartProduct) => {
			
			// Product id
			const id: number = Number(product.id);
			
			// Product index
			const productIndex: number = storage.getIndex(Number(id));
			
			// If the product exists and has stock
			if(ids.indexOf(id) >= 0 && Number(availableProducts[productIndex]?.stock) > 0) {
				
				// Gets the product index in the cart
				const index: number = cart.products.findIndex((cartProduct: CartProduct) => cartProduct.id === product.id);
				
				// Amount
				const amount: number = Math.min(Number(availableProducts[productIndex].stock), index < 0 ? product.amount : cart.products[index].amount + product.amount);
				
				// Updates the product or adds a new one
				index < 0 ? cart.products.push({ ...availableProducts[productIndex], amount }) : cart.products[index].amount = amount;
				
			}
			
		});
		
		// Sets the cart
		await this.save(this.carts);
		
		// (:
		return cart;
		
	}
	
	/**
	 * Add products to existing cart or creates a new one
	 * @param {number} id
	 * @param {number} productId
	 * @return {Cart | boolean}
	 */
	
	async removeFromCart(id: number, productId: number): Promise<Cart | boolean> {
		
		// Await for the products to load
		await this.verifyLoaded();
		
		// Gets the cart index
		const index: number = this.getIndex(id);
		
		// If the cart does not exist
		if(index < 0) return false;
		
		// Cart
		const cart: Cart = this.carts[index];
		
		// Product index
		const productIndex = cart.products.findIndex((product: CartProduct) => product.id === productId);
		
		// If the product is in the cart
		if(productIndex >= 0) {
			
			// Removed the product from the cart
			cart.products.splice(productIndex, 1);
			
			// Sets the cart
			await this.save(this.carts);
			
		}
		
		// (:
		return cart;
		
	}
	
	/**
	 * Gets a cart by id
	 * @param {number} id
	 * @return {Cart | false}
	 */
	
	async get(id: number): Promise<Cart | boolean> {
		
		// Await for the products to load
		await this.verifyLoaded();
		
		// (:
		return this.carts.filter((cart: Cart) => cart.id === id)[0] || false;
		
	}
	
	/**
	 * Gets a cart index by id
	 * @param {number} id
	 * @return {number}
	 */
	
	private getIndex(id: number): number {
		
		// (:
		return this.carts.findIndex((cart: Cart) => Number(cart.id) === id);
		
	}
	
	/**
	 * Deletes a cart by id
	 * @param {number} id
	 * @return {boolean}
	 */
	
	async delete(id: number): Promise<boolean> {
		
		// Await for the products to load
		await this.verifyLoaded();
		
		// Gets the cart index
		const index: number = this.getIndex(id);
		
		// ):
		if(index < 0) return false;
		
		// Removes the cart from the product array
		this.carts.splice(index, 1);
		
		// Sets the product
		await this.save(this.carts);
		
		// ( :
		return true;
		
	}
	
	/**
	 * Check the products have been loaded from the filesystem
	 * @private
	 */
	
	private async verifyLoaded() {
		
		// If the carts have not been loaded
		if(this.loaded === false) {
			
			// Set the carts
			await this.getAll().then(carts => {
				this.carts = carts;
				this.maxId = this.carts[this.carts.length - 1]?.id || 0;
			});
			
			// Sets the carts as loaded
			this.loaded = true;
			
		}
		
	}
	
}

export { Cart, CartProduct };
export default Carts;