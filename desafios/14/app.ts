import express = require('express');
import { Express, NextFunction, Request, Response } from 'express';
import { AddressInfo } from 'net';
import { config } from 'dotenv';
import session = require('express-session');
import routes from './src/routes/Auth/Auth';
import { engine } from 'express-handlebars';
import passport = require('passport');
import yargs = require('yargs');
import { hideBin } from 'yargs/helpers';
import cluster from 'cluster';
import * as os from 'os';
import { ChildProcess, fork } from 'child_process';
import compression = require('compression');
import * as winston from 'winston';
import { ConsoleTransportInstance, FileTransportInstance } from "winston/lib/winston/transports";

type CLIArgs = {
	[x: string]: unknown,
	port: number,
	mode: string,
	cpus: number,
	gzip: boolean,
	log: string,
	_: (string | number)[],
	$0: string,
};

// Command line arguments
const argv : CLIArgs | Promise<CLIArgs> = yargs(hideBin(process.argv)).option({
	port : { type : 'number', default : 8080, alias : 'p' },
	mode : { type : 'string', default : 'fork', alias : 'm' },
	cpus : { type : 'number', default : os.cpus().length, alias : 'c' },
	gzip : { type : 'boolean', default : false, alias : 'g' },
	log  : { type : 'string', default : 'info', alias : 'l' }
}).argv as CLIArgs;

// Destructed constants
const { port, mode, cpus, gzip, log } = argv;

// Initializes dotevn
config();

// Logs

const transports: Array<FileTransportInstance | ConsoleTransportInstance> = [
	new winston.transports.File({ filename : 'logs/warn.log', level : 'warn' }),
	new winston.transports.File({ filename : 'logs/error.log', level : 'error' }),
];

if(process.env.NODE_ENV !== 'production') transports.push(new winston.transports.Console());

const logger = winston.createLogger({
	level : log,
	transports
});

// Configuration
const PORT: string | number = process.env.PORT || port;

// If on primary process
if(mode === 'cluster' && cluster.isPrimary === true) {
	
	logger.log('info', `Corriendo proceso principal (PID: ${process.pid}).`);
	
	// For each CPU, forks the process
	for(let x = 0, max = cpus; x < Math.min(max, os.cpus().length); x = x + 1) {
		cluster.fork();
	}

}

else {

	// Creates the server
	const app: Express = express();
	
	// Handlebars
	app.engine('handlebars', engine({
		defaultLayout : 'main'
	}));
	app.set('view engine', 'handlebars');
	app.set('views', `${__dirname}/views`);
	
	// Use compression
	if(gzip === true) {
		logger.log('info', 'Usando compresión gzip')
		app.use(compression());
	}
	
	// Extras
	app.use(express.urlencoded({ extended : true }));
	app.use(session({
		secret            : process.env.SESSION_SECRET_KEY || 'sessionPassword',
		rolling           : true,
		resave            : true,
		saveUninitialized : false,
		cookie            : {
			maxAge   : 60000,
			secure   : false,
			httpOnly : false
		}
	}));
	
	// Passport
	app.use(passport.initialize());
	app.use(passport.session());
	
	// Routes
	app.use(routes);
	
	// Log all routes
	app.use((request: Request, response: Response, next: NextFunction) => {
		logger.log('info', `Ruta ejecutada: ${request.originalUrl}`);
		next();
	});
	
	// Custom paths
	app
		.get('/info', (request: Request, response: Response) => {
			try {
				response.render('info', {
					platform : process.platform,
					argv     : JSON.stringify(argv),
					execPath : process.execPath,
					pid      : process.pid,
					memory   : process.memoryUsage.rss(),
					version  : process.version,
					cpus     : os.cpus().length,
				});
			} catch(err) {
				logger.log('error', `Ocurrió un error ${err}`);
			}
		})
		.get('/api/randoms', (request: Request, response: Response) => {
			response.setHeader('Content-Type', 'application/json; charset=UTF-8');
			try {
				const forked: ChildProcess = fork('./scripts/randoms.ts');
				forked
					.on('message', (message: { randoms: Array<number> }) => {
						response.json({ randoms : message.randoms });
					})
					.send({ command : 'start', amount : Number(request.query?.amount) || 1e8 });
			} catch(err) {
				logger.log('error', `Ocurrió un error ${err}`);
				response.json({ error : 'Ocurrió un error' });
			}
		})
		.get('*', (request: Request, response: Response) => {
			logger.log('warn', `Ruta no encontrada: ${request.originalUrl}`);
			response.status(404).render('error-404');
		})
	
	// Listener
	const server = app.listen(PORT, () => {
		const { port } = server.address() as AddressInfo;
		logger.log('info', `Subproceso corriendo en puerto ${port} (PID: ${process.pid})`);
	});
	
	// Error handler
	server.on('error', (err: string) => {
		logger.log('error', `Ocurrió un error ${err}`);
	});

}