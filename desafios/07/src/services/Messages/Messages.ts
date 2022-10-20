import Container from "../Container/Container";
import { Validation, ValidationResult } from "../Products/Products";
import { Knex } from "knex";
import CreateTableBuilder = Knex.CreateTableBuilder;

// Products type
type Message = {
	[key: string]: number | String | Date | undefined,
	id?: number,
	from?: String,
	message?: number,
	date?: Date
};

/**
 * Products class
 * @class
 */

class Messages extends Container {
	
	private tableCreated: boolean = false;
	
	/**
	 * Constructor
	 * @param {Object} config
	 */
	
	constructor(config: object) {
		
		// Super constructor
		super(config, 'messages');
		
	}
	
	/**
	 * Saves a new message to the messages storage
	 * @param {Message} message
	 * @return {Message | ValidationResult}
	 */
	
	async create(message: Message): Promise<ValidationResult | Message | boolean> {
		
		// Checks if the table has been created
		await this.checkTable();
		
		// Validate the message
		const validation: ValidationResult = this.validateMessage(message);
		
		// If any error ocurred
		if(validation.errors.length > 0) return validation;
		
		// Sets the message
		const result = await this.store([{ ...message }]);
		
		// (:
		return result === true ? message : false;
		
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
						table.string('from', 255);
						table.text('message')
						table.timestamp('date').defaultTo(this.connection.fn.now());
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
	 * Validates a message
	 * @param {Message} message
	 * @return {ValidationResult}
	 */
	
	validateMessage(data: Message): ValidationResult {
		
		// Validate the passed product
		const results: Array<Validation> = [
			{
				field     : 'from',
				validator : (value: any): boolean => {
					const matches: Array<string> | null = String(value).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
					return matches !== null && matches.length > 0;
				},
				message   : 'El campo <from> es obligatorio y debe ser un email'
			},
			{
				field     : 'message',
				validator : (value: any): boolean => {
					return value !== null && value !== '';
				},
				message   : 'El campo <message> es obligatorio'
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

export { Message };
export default Messages;