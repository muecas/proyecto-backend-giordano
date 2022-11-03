import { Request, Response, Router } from 'express';
import Products, { Product, ValidationResult, isValidationResult } from '../../services/Products/Products';
import { isAdmin } from "../Utils/Utils";
import { config } from '../../data-access/data-access';

// Container
const storage: Products = new Products(config);

// Endpoint router
const routes = Router();

// Routes definition
routes
	.get('/', async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		await storage
			.getAll()
			.then((products: Array<object>) => {
				response.send({ products });
			})
			.catch(err => {
				response.json({
					error : 'Ocurrió un error al intentar cargar los productos',
				});
			});
	})
	.get('/:id', async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		await storage
			.get(request.params.id)
			.then((result: object | null) => {
				result !== null ?
					response.json({ product : result }) :
					response.json({
						error : 'Producto no encontrado',
					});
			})
			.catch(err => {
				response.json({
					error : 'Ocurrió un error al intentar cargar el producto',
				});
			});
	})
	.post('/', isAdmin, async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		await storage
			.create({
				name      : request.body.name,
				price     : Number(request.body.price),
				thumbnail : request.body.thumbnail
			})
			.then((result: ValidationResult | Product | boolean) => {
				if(result !== false) {
					isValidationResult(result) === true && (result as ValidationResult).errors.length > 0 ?
						response.json({
							error  : 'Verifica los campos ingresados',
							errors : (result as ValidationResult).errors,
						}) :
						response.json({
							message : 'Producto creado con éxito',
							product : result
						});
				} else {
					response.json({
						error : 'Ocurrió un error al intentar ingresar el registro',
					});
				}
			})
			.catch(err => {
				response.json({
					error : 'Ocurrió un error al intentar ingresar el producto',
				});
			});
	})
	.put('/:id', isAdmin, async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		await storage
			.edit(request.params.id, {
				name      : request.body?.name || undefined,
				price     : request.body?.price ? Number(request.body.price) : undefined,
				thumbnail : request.body?.thumbnail || undefined
			})
			.then((result: Product | ValidationResult | boolean | null) => {
				if(result !== false) {
					if (result === null) {
						response.json({
							error : 'Producto no encontrado',
						});
					} else {
						isValidationResult(result) === true && (result as ValidationResult).errors.length > 0 ?
							response.json({
								error  : 'Verifica los campos ingresados',
								errors : (result as ValidationResult).errors,
							}) :
							response.json({
								message : 'Producto editado con éxito',
								product : result,
							});
					}
				} else {
					response.json({
						error : 'Ocurrió un error al intentar editar el registro',
					});
				}
			})
			.catch(err => {
				response.json({
					error : 'Ocurrió un error al intentar editar el producto',
				});
			});
	})
	.delete('/:id', isAdmin, async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		await storage
			.remove(request.params.id)
			.then((result: boolean | null) => {
				if(result !== false) {
					if(result === null) {
						response.json({
							error : 'Producto no encontrado',
						});
					} else {
						response.json({
							message : 'Producto eliminado con éxito',
						});
					}
				} else {
					response.json({
						error : 'Ocurrió un error al intentar eliminar el registro',
					});
				}
			})
			.catch(err => {
				response.json({
					error : 'Ocurrió un error al intentar eliminar el producto',
				});
			});
	});

export default routes;