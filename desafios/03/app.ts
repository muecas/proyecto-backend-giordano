import express = require('express');
import { Express, Request, Response } from "express";
import Container from "./services/Container/Container";

// Configuration
const PORT: number | string = process.env.PORT || 3000;

// Creates the server
const app: Express = express();

// Listener
const server = app.listen(PORT, () => {
	console.log(`Servidor corriendo en puerto ${server.address().port}!`);
});

// Error handler
server.on('error', (err: string) => {
	console.log(`Ocurrió un error ${err}.`);
});

// Container
const container: Container = new Container('./data/products.json');

// Endpoints
app
	.get('/productos', async (request: Request, response: Response) => {
		const products = await container.getAll();
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		response.send(products);
	})
	.get('/productoRandom', async (request: Request, response: Response) => {
		const products = await container.getAll();
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		response.send(products[Math.floor(Math.random() * products.length)]);
	});