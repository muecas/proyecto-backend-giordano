import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { ConnectionConfig } from "../../config/ConnectionConfig";

/**
 * Mongo data access class
 * @class
 */

class Mongo {
	
	readonly collectionName: string;
	readonly collection : Collection;
	readonly aggregationFields: object = {};
	
	/**
	 * Constructor
	 * @param {ConnectionConfig} config
	 * @param {String}           collectionName
	 */
	
	constructor(config: ConnectionConfig, collectionName: string) {
		
		// Sets the table name
		this.collectionName = collectionName;
		
		// Creates the connection
		const client: MongoClient = new MongoClient(<string> config.uri);
		const database: Db = client.db(<string> config.database);
		this.collection = database.collection(<string> this.collectionName);
		
	}
	
	/**
	 * Creates the record
	 * @param {Object} data
	 * @return {Promise<boolean>}
	 */
	
	async insert(data: Object): Promise<any |boolean> {
		
		// Inserts the record
		const result = await this.collection
			.insertOne(data)
			.then(({ insertedId }) => insertedId)
			.catch(err => {
				console.log(err);
				return false;
			});
		
		// Unsets the id
		delete (data as { _id: any })._id;
		
		// (:
		return result;
		
	}
	
	/**
	 * Updated the record
	 * @param {*}      id
	 * @param {Object} data
	 * @return {Promise<boolean>}
	 */
	
	async update(id: any, data: object): Promise<boolean> {
		
		// (:
		return await this.collection
			.updateOne({ _id : new ObjectId(id) }, { $set : data })
			.then(() => true)
			.catch(err => {
				console.log(err);
				return false;
			});
		
	}
	
	/**
	 * Deletes the record
	 * @param {*} id
	 * @return {Promise<boolean>}
	 */
	
	async delete(id: any): Promise<boolean> {
		
		// (:
		return await this.collection
			.deleteOne({ _id : new ObjectId(id) })
			.then(() => true)
			.catch(err => {
				console.log(err);
				return false;
			});
		
	}
	
	/**
	 * Gets a record by id
	 * @param {*} id
	 * @return {object|boolean}
	 */
	
	async get(id: any): Promise<object | null> {
		
		// Gets the matched record by id
		const result = await this.collection
			.aggregate([
				this.aggregationFields,
				{
					$match    : {
						id : new ObjectId(id)
					}
				},
				{
					$limit : 1
				}
			])
			.toArray()
			.catch(err => {
				console.log(err);
				return null;
			});
		
		// (:
		return result !== null && result.length > 0 ? result[0] : null;
		
	}
	
	/**
	 * Gets all records
	 * @return {Array|boolean}
	 */
	
	async getAll(): Promise<Array<object>> {
		
		// (:
		return await this.collection.aggregate([
			this.aggregationFields
		]).toArray();
		
	}
	
}

export default Mongo;