import knex, { Knex } from 'knex';
import CreateTableBuilder = Knex.CreateTableBuilder;
import MySQLConfig from './src/config/mysql';
import SQLite3Config from './src/config/sqlite3';
import { MongoClient, Db } from 'mongodb';
import MongoConfig from './src/config/mongodb';

switch(process.env.DB_ENGINE) {
	
	// MySQL/SQLite3
	case 'mysql':
	case 'sqlite3':
		const db = knex(<object> (process.env.DB_ENGINE === 'mysql' ? MySQLConfig : SQLite3Config));
		db
			.schema
			.createTable('products', (table: CreateTableBuilder): void => {
				table.increments('id');
				table.string('name', 255);
				table.float('price')
				table.text('thumbnail');
			})
			.then(() => console.log('Tabla "products" creada con éxito'))
			.then(() => {
				db
					.schema
					.createTable('carts', (table: CreateTableBuilder): void => {
						table.increments('id');
						table.integer('timestamp');
						table.text('products');
					})
					.then(() => console.log('Tabla "carts" creada con éxito'))
					.then(() => process.exit(0))
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
		break;
	
	// Firebase
	case 'firebase':
		console.log('No es necesaria la creación previa de las colecciones para el caso de Firebase');
		process.exit(0);
	
	// Mongo
	case 'mongo':
	default:
		console.log('Using MongoDB');
		const client: MongoClient = new MongoClient(<string> MongoConfig.uri);
		const database: Db = client.db(<string> MongoConfig.database);
		database.createCollection('products')
			.then(() => console.log('Colección "products" creada con éxito'))
			.then(() => {
				database.createCollection('carts')
					.then(() => console.log('Colección "carts" creada con éxito'))
					.then(() => process.exit(0))
					.catch(err => console.log(err))
			})
			.catch(err => console.log(err));
		break;
	
}