import express = require('express');
import http = require('http');
import { Express, Request, Response, Router } from 'express';
import { AddressInfo } from 'net';
import { Server, Socket } from "socket.io";
import { engine } from "express-handlebars";
import Products, { Product, ValidationResult } from './src/services/Products/Products';
import Container from "./src/services/Container/Container";

// Configuration
const PORT: number | string = process.env.PORT || 8080;

// Creates the server
const app: Express = express();
const server: http.Server = http.createServer(app);
const io: Server = new Server(server);

// Extras
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Handlebars
app.engine('handlebars', engine({
	defaultLayout : 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);

// Containers
const products: Products = new Products();
const container: Container = new Container('./data/messages.json');

// Endpoint router
const routes: Router = Router();

// Routes definition
routes
	.get('/', (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'text/html; charset=UTF-8');
		const query: Object = request.query.hasOwnProperty('result') === true && JSON.parse(<string> request.query.result) || {};
		response.render('form', query);
	})
	.post('/productos', (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		const result: Product | ValidationResult = products.create({
			title     : request.body.title,
			price     : Number(request.body.price),
			thumbnail : request.body.thumbnail
		});
		if(result.hasOwnProperty('errors') === true) {
			response.json({ error: 'Verifica los campos ingresados', errors: result['errors'] })
		} else {
			io.sockets.emit('products', { products : products.getAll() });
			response.json(result);
		}
	});

// Endpoints
app.use(routes);

// Listener
server.listen(PORT, () => {
	const { port } = server.address() as AddressInfo;
	console.log(`Servidor corriendo en puerto ${port}!`);
});

// Error handler
server.on('error', (err: string) => {
	console.log(`Ocurri?? un error ${err}.`);
});

// Socket listener
io.on('connection', async (socket: Socket) => {
	socket.emit('products', { products : products.getAll() });
	await container.getAll().then(messages => socket.emit('messages', { messages }));
	socket.on('message', async (data) => {
		await container.save({ date : new Date(), ...data });
		container.getAll().then(messages => io.sockets.emit('messages', { messages }));
	});
});