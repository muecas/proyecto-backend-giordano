import { Request, Response, Router } from 'express';
import Products, { Product, ValidationResult, isValidationResult } from '../../services/Products/Products';
import { isAdmin } from "../Utils/Utils";

// Container
const storage: Products = new Products();

// Endpoint router
const routes = Router();

// Routes definition
routes
	.get('/', async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		await storage.all().then((products: Array<Product>) => {
			response.send({ products });
		});
	})
	.get('/:id', async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		await storage.get(Number(request.params.id)).then((product: Product | boolean) => {
			product !== false ?
				response.json({ product }) :
				response.json({
					error : 'Producto no encontrado'
				});
		});
	})
	.post('/', isAdmin, async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		await storage.create({
			name        : request.body.name,
			description : request.body.description,
			sku         : request.body.sku,
			price       : Number(request.body.price),
			stock       : Number(request.body.stock),
			thumbnail   : request.body.thumbnail
		}).then((result: ValidationResult | Product) => {
			isValidationResult(result) === true && (result as ValidationResult).errors.length > 0 ?
				response.json({
					error  : 'Verifica los campos ingresados',
					errors : result.errors
				}) :
				response.json(result);
		});
	})
	.put('/:id', isAdmin, async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		await storage.update(Number(request.params.id), {
			name        : request.body?.name,
			description : request.body?.description,
			sku         : request.body?.sku,
			price       : Number(request.body?.price),
			stock       : Number(request.body?.stock),
			thumbnail   : request.body?.thumbnail
		}).then((result: Product | ValidationResult | false) => {
			if (result === false) response.json({error: 'Producto no encontrado'});
			else isValidationResult(result) === true && (result as ValidationResult).errors.length > 0 ?
				response.json({
					error  : 'Verifica los campos ingresados',
					errors : result.errors
				}) :
				response.json({
					product : result
				});
		});
	})
	.delete('/:id', isAdmin, async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		await storage.delete(Number(request.params.id)).then((product: boolean) => {
			product !== false ?
				response.json({
					message : 'Producto eliminado con éxito'
				}) :
				response.json({
					error : 'Producto no encontrado'
				});
		});
	});

export default routes;