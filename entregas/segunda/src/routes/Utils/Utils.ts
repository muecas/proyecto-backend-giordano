import { Request, Response, NextFunction } from "express";
import config from '../../config/config';

/**
 * Check if the user is an admin
 * @param {Request}      request
 * @param {Response}     response
 * @param {NextFunction} next
 */

function isAdmin(request: Request, response: Response, next: NextFunction) {
	config.IS_ADMIN === true ?
		next() :
		response.status(401).json({
			errorCode : -1,
			error     : `${request.method}:${request.baseUrl}${request.url} no autorizado`
		});
}

/**
 * Routes catchall
 * @param {Request}  request
 * @param {Response} response
 */

function catchAll(request: Request, response: Response) {
	response.status(404);
	response.json({
		errorCode : -2,
		error     : `${request.method}:${request.baseUrl}${request.url} no implementado`
	});
}

export { isAdmin, catchAll };