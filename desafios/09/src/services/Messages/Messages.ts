import Container from "../Container/Container";
import { PathLike } from "fs";
import { normalize, denormalize, schema, NormalizedSchema } from "normalizr";
import Entity = schema.Entity;

// Message type
type Message = {
	[key: string]: number | Author | String | undefined,
	id?: number,
	author?: Author,
	message?: String,
	date?: number
};

// Author type
type Author = {
	[key: string]: number | String | PathLike | undefined,
	email?: String,
	first_name?: String,
	last_name?: String,
	age?: number,
	alias?: String,
	avatar?: PathLike
};

// Normalizr entities
const authorSchema: Entity = new Entity('authors', {}, { idAttribute : 'email' });
const messageSchema: Entity = new Entity('messages', { author : authorSchema });

/**
 * Products class
 * @class
 */

class Messages extends Container {
	
	// Messages array
	private messages: Array<Message>;
	
	/**
	 * Constructor
	 * @param {Array<Message>} messages
	 */
	
	constructor(messages: Array<Message> = []) {
		
		// Initializes the main class
		super('./data/messages.json');
		
		// Set the products
		this.messages = messages;
		
	}
	
	/**
	 * Saves a new message to the messages storage
	 * @param {Message} message
	 * @return {Message|ValidationResult}
	 */
	
	async create(message: Message): Promise<Message> {
		
		// Sets the message date
		message.date = Date.now();
		
		// Sets the message
		const id: number = await this.save(message);
		
		// Record
		const record: Message = { id, ...message };
		
		// Sets the message
		this.messages.push(record);
		
		// (:
		return record;
		
	}
	
	/**
	 * Gets all records
	 * @return {Array|boolean}
	 */
	
	async getAll(): Promise<Array<Message>> {
		
		// (:
		return await super.getAll();
		
	}
	
	/**
	 * Normalizes data
	 * @param {object} data
	 * @return {object}
	 */

	normalize(data: object): object {
	
		// (:
		return normalize(data, messageSchema);
	
	}
	
	/**
	 * Denormalizes normalized data
	 * @param {NormalizedSchema} data
	 * @return {object}
	 */
	
	denormalize(data: NormalizedSchema<any, any>): object {
		
		// (:
		return denormalize(data.result, messageSchema, data.entities);
	
	}
	
}

export { Message };
export default Messages;