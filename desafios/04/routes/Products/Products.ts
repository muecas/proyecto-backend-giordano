import { Request, Response, Router } from 'express';
import Products, { Product, Validation, ValidationResult } from '../../services/Products/Products';

// Container
const storage: Products = new Products();

// Endpoint router
const routes = Router();

// Routes definition
routes
	.get('/', (request: Request, response: Response) => {
		const products: Array<Product> = storage.getAll();
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		response.send(products);
	})
	.get('/:id', (request: Request, response: Response) => {
		const product: Product | boolean = storage.getById(Number(request.params.id));
		product !== false ?
			response.json(product) :
			response.json({ error : 'Producto no encontrado' });
	})
	.post('/', (request: Request, response: Response) => {
		const result: Product | ValidationResult = storage.create({
			title     : request.body.title,
			price     : Number(request.body.price),
			thumbnail : request.body.thumbnail
		});
		result.hasOwnProperty('errors') === true ?
			response.json({ error : 'Verifica los campos ingresados', errors : result['errors'] }) :
			response.json(result);
	})
	.put('/:id', (request: Request, response: Response) => {
		const result: Product | ValidationResult | boolean = storage.update(Number(request.params.id), {
			title     : request.body?.title,
			price     : Number(request.body?.price),
			thumbnail : request.body?.thumbnail
		});
		if(result === false) response.json({ error : 'Producto no encontrado' });
		result.hasOwnProperty('errors') === true ?
			response.json({ error : 'Verifica los campos ingresados', errors : result['errors'] }) :
			response.json(result);
	})
	.delete('/:id', (request: Request, response: Response) => {
		const product: Product | boolean = storage.deleteById(Number(request.params.id));
		product !== false ?
			response.json({ message : 'Producto eliminado con éxito' }) :
			response.json({ error : 'Producto no encontrado' });
	});

export default routes;