import express = require('express');
import { Express } from 'express';
import { AddressInfo } from 'net';
import routes from './routes/Products/Products';

// Configuration
const PORT: number | string = process.env.PORT || 8080;

// Creates the server
const app: Express = express();

// Extras
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Endpoints
app.use('/api/productos', routes);

// Listener
const server = app.listen(PORT, () => {
	const { port } = server.address() as AddressInfo;
	console.log(`Servidor corriendo en puerto ${port}!`);
});

// Error handler
server.on('error', (err: string) => {
	console.log(`Ocurrió un error ${err}.`);
});