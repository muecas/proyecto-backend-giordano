import knex, { Knex } from 'knex';
import CreateTableBuilder = Knex.CreateTableBuilder;

/**
 * Container class
 * @class
 */

class Container {
	
	readonly tableName: string;
	readonly connection;
	
	/**
	 * Constructor
	 * @param {PathLike} file
	 * @param {String}   encoding
	 */
	
	constructor(config: object, tableName: string) {
		
		// Sets the table name
		this.tableName = tableName;
		
		// Creates the instance
		this.connection = knex(config);
		
	}
	
	/**
	 * Creates the table
	 * @param {any} create
	 * @return {Promise<boolean>}
	 */
	
	async createTable(create: (table: CreateTableBuilder) => void): Promise<boolean> {
		
		// Creates the
		return this.connection.schema
			.createTable(this.tableName, create)
			.then(() => true)
			.catch(err => {
				console.log(err);
				return false;
			});
		
	}
	
	/**
	 * Stores the record
	 * @param {Array} records
	 * @return {Promise<boolean>}
	 */
	
	async store(records: Array<object>): Promise<boolean> {
		
		return await
			this.connection(this.tableName).insert(records)
			.then(() => true)
			.catch(err => {
				console.log(err);
				return false;
			});
		
	}
	
	/**
	 * Gets all records
	 * @param {Number} id
	 * @return {Array|boolean}
	 */
	
	async getAll(): Promise<Array<object> | boolean> {
		
		// (:
		return await this.connection
			.from(this.tableName)
			.select('*')
			.then((records: Array<any>) => records)
			.catch(err => {
				console.log(err);
				return false;
			})
		
	}
	
	/**
	 * Destroys the connection
	 */
	
	destroy(): void {
		
		// (:
		this.connection.destroy();
		
	}
	
}

export default Container;