import express = require('express');
import { Express } from 'express';
import { Server as HttpServer } from 'http';
import { AddressInfo } from 'net';
import products from '../../routes/Products/Products';
import carts from '../../routes/Carts/Carts';
import { catchAll } from "../../routes/Utils/Utils";

/**
 * Server class
 * @class
 */

class Server {
	
	private readonly port: number;
	private readonly app: Express;
	private server!: HttpServer;
	
	/**
	 * Server constructor
	 * @param {number|string} port
	 */
	
	constructor(port: number | string = 8080) {
		
		// Sets the port
		this.port = Number(port);
		
		// Sets the app
		this.app = express();
		
		// Extras
		this.app.use(express.json());
		
		// Endpoints
		this.app.use('/api/productos', products);
		this.app.use('/api/carrito', carts);
		
		// Catch all
		this.app.all('*', catchAll);
		
	}
	
	
	/**
	 * Gets the app instance
	 * @return {Express}
	 */
	
	getApp(): Express {
		
		// (:
		return this.app;
		
	}
	
	/**
	 * Starts the server
	 */
	
	start(): void {
		
		// Listener
		this.server = this.app.listen(this.port, () => {
			const { port } = this.server.address() as AddressInfo;
			console.log(`Servidor corriendo en puerto ${port}!`);
		});
		
		// Error handler
		this.server.on('error', (err: string) => {
			console.log(`Ocurrió un error ${err}.`);
		});
		
	}
	
}

export default Server;