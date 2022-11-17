import express = require('express');
import { Express } from 'express';
import { AddressInfo } from 'net';
import { config } from 'dotenv';
import session = require('express-session');
import MongoStore = require('connect-mongo');
import routes from './src/routes/Auth/Auth';
import { engine } from 'express-handlebars';

// Initializes dotevn
config();

// Configuration
const PORT: number | string = process.env.PORT || 8080;

// Creates the server
const app: Express = express();

// Handlebars
app.engine('handlebars', engine({
	defaultLayout : 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);

// Extras
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(session({
	secret            : process.env.SESSION_SECRET_KEY || 'sessionPassword',
	store             : MongoStore.create({
		mongoUrl : 'mongodb+srv://dbuser:zhKHjP4o7SeWDBG4@basecluster.jcv2pea.mongodb.net/?retryWrites=true&w=majority',
		ttl      : 600
	}),
	resave            : true,
	saveUninitialized : true,
	cookie: {
		maxAge   : 60000,
		httpOnly : true
	}
}));

// Routes
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