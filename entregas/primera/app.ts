import express = require('express');
import { Express } from 'express';
import { AddressInfo } from 'net';
import products from './src/routes/Products/Products';
import carts from './src/routes/Carts/Carts';
import { catchAll } from "./src/routes/Utils/Utils";

// Configuration
const PORT: number | string = process.env.PORT || 8080;

// Creates the server
const app: Express = express();

// Extras
app.use(express.json());

// Endpoints
app.use('/api/productos', products);
app.use('/api/carrito', carts);

// Catch all
app.all('*', catchAll);

// Listener
const server = app.listen(PORT, () => {
	const { port } = server.address() as AddressInfo;
	console.log(`Servidor corriendo en puerto ${port}!`);
});

// Error handler
server.on('error', (err: string) => {
	console.log(`Ocurrió un error ${err}.`);
});