import express = require('express');
import { Express } from 'express';
import { AddressInfo } from 'net';
import routes from './src/routes/Products/Products';

// Configuration
const PORT: number | string = process.env.PORT || 8080;

// Creates the server
const app: Express = express();

// Extras
app.use(express.urlencoded({ extended : true }));

// EJS
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

// Endpoints
app.use(routes);

// Listener
const server = app.listen(PORT, () => {
	const { port } = server.address() as AddressInfo;
	console.log(`Servidor corriendo en puerto ${port}!`);
});

// Error handler
server.on('error', (err: string) => {
	console.log(`Ocurrió un error ${err}.`);
});