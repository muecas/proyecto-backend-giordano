import { Request, Response, Router } from 'express';
import Carts, { Cart, CartProduct } from '../../services/Carts/Carts';

// Container
const storage: Carts = new Carts();

// Endpoint router
const routes = Router();

// Routes definition
routes
	.post('/', async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		await storage.create().then((cart: Cart) => {
			response.json({ cart });
		});
	})
	.get('/:id', async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		await storage.get(Number(request.params.id)).then((cart: Cart | boolean) => {
			cart !== false ?
				response.json({ cart }) :
				response.json({
					error : 'Carro de compras no encontrado'
				});
		});
	})
	.get('/:id/productos', async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		await storage.get(Number(request.params.id)).then((cart: Cart | boolean) => {
			cart !== false ?
				response.json({
					products : (cart as Cart).products
				}) :
				response.json({
					error : 'Carro de compras no encontrado'
				});
		});
	})
	.post('/:id/productos', async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		const products: Array<CartProduct> = request.body.products.map((product: { id: string, amount?: string }) => ({ id : Number(product.id), amount : Number(product.amount) }));
		await storage.addToCart(Number(request.params.id), products).then((cart: Cart | boolean) => {
			cart !== false ?
				response.json({ cart }) :
				response.json({
					error : 'Carro de compras no encontrado'
				});
		});
	})
	.delete('/:id/productos/:product_id', async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		await storage.removeFromCart(Number(request.params.id), Number(request.params.product_id)).then((cart: Cart | boolean) => {
			cart !== false ?
				response.json({ cart }) :
				response.json({ error : 'Carro de compras no encontrado' });
		});
	})
	.delete('/:id', async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		await storage.delete(Number(request.params.id)).then((cart: boolean) => {
			cart !== false ?
				response.json({
					message : 'Carrito eliminado con éxito'
				}) :
				response.json({
					error : 'Carrito no encontrado'
				});
		});
	});

export default routes;