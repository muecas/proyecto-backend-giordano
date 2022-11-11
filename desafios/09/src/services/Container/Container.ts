import * as fs from 'fs';
import { ObjectEncodingOptions, PathLike } from 'fs';

/**
 * Container class
 * @class
 */

class Container {
	
	private readonly file: PathLike;
	private readonly encoding: ObjectEncodingOptions;
	
	/**
	 * Constructor
	 * @param {PathLike} file
	 * @param {String}   encoding
	 */
	
	constructor(file: PathLike, encoding: string = 'utf-8') {
		
		// Sets the file and encoding
		this.file     = file;
		this.encoding = { encoding : 'utf8' };
		
	}
	
	/**
	 * Saves a new object to the file
	 * @param {Object} object
	 * @return {Number}
	 */
	
	async save(object: Object): Promise<number> {
		
		// Gets the file content
		const content: Array<any> | boolean = await this.read();
		
		// Sets the new id
		const id: number = typeof content !== 'boolean' ? content[content.length - 1]?.id + 1 || 1 : 1;
		
		// New record to add
		const record = { id, ...object };
		
		// Saves the file
		await this.write(JSON.stringify(typeof content !== 'boolean' ? [...content, record] : [record]));
		
		// (:
		return id;
		
	}
	
	/**
	 * Gets a record by id
	 * @param {Number} id
	 * @return {Object|Boolean}
	 */
	
	async getById(id: Number): Promise<Object | boolean> {
		
		// Gets the file content
		const content: Array<any> | boolean = await this.read();
		
		// (:
		return typeof content !== 'boolean' ? content.filter(result => result.id === id)[0] : false;
		
	}
	
	/**
	 * Gets all records
	 * @param {Number} id
	 * @return {Array}
	 */
	
	async getAll(): Promise<Array<any>> {
		
		// Gets the file content
		const content: Array<any> | boolean = await this.read();
		
		// (:
		return typeof content !== 'boolean' ? content : [];
		
	}
	
	/**
	 * Deletes a record by id
	 * @param {Number} id
	 * @return {Boolean}
	 */
	
	async deleteById(id: Number): Promise<boolean> {
		
		// Gets the file content
		const content: Array<any> | boolean = await this.read();
		
		// (:
		return typeof content !== 'boolean' ? await this.write(JSON.stringify(content.filter(record => record.id !== id))) : false;
		
	}
	
	/**
	 * Deletes a record by id
	 * @param {Number} id
	 * @return {Boolean}
	 */
	
	async deleteAll(): Promise<boolean> {
		
		// (:
		return await this.write(JSON.stringify([]));
		
	}
	
	/**
	 * Reads the file
	 * @private
	 * @return {Array|boolean}
	 */
	
	private async read(): Promise<Array<any> | boolean> {
		try {
			const response: string | Buffer = await fs.promises.readFile(this.file, this.encoding);
			return JSON.parse(<string> response);
		} catch(err) {
			return false;
		}
	}
	
	/**
	 * Writes data to the file
	 * @param {string} data
	 * @private
	 */
	
	private async write(data : string): Promise<boolean> {
		try {
			await fs.promises.writeFile(this.file, data, this.encoding);
			return true;
		} catch(err) {
			return false;
		}
	}
	
}

export default Container;