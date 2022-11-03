import MongoContainer from "./Mongo/Mongo";
import MongoConfig from '../config/mongodb';
import FirebaseContainer from "./Firebase/Firebase";
import KnexContainer from './Knex/Knex';
import MySQLConfig from '../config/mysql';
import SQLite3Config from '../config/sqlite3';
import { ConnectionConfig } from "../config/ConnectionConfig";

let container: any, config: ConnectionConfig;

switch(process.env.DB_ENGINE) {
	
	// MySQL/SQLite3
	case 'mysql':
	case 'sqlite3':
		container = KnexContainer;
		config    = process.env.DB_ENGINE === 'mysql' ? MySQLConfig : SQLite3Config;
		break;
	
	// Firebase
	case 'firebase':
		container = FirebaseContainer;
		config = {};
		break
	
	// Mongo
	case 'mongo':
	default:
		container = MongoContainer;
		config    = MongoConfig;
	
}

export { container as Container, config };