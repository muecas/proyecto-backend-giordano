import { Request, Response, Router } from 'express';
import Carts, { Cart, CartProduct } from '../../services/Carts/Carts';
import { config } from '../../data-access/data-access';

// Container
const storage: Carts = new Carts(config);

// Endpoint router
const routes = Router();

// Routes definition
routes
	.post('/', async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		await storage
			.create()
			.then((result: Cart | boolean) => {
				result !== false ?
					response.json({
						message : 'Carro creado con éxito',
						cart    : result,
					}) :
					response.json({
						error : 'Ocurrió un error al intentar ingresar el registro',
					});
			})
			.catch(err => {
				response.json({
					error : 'Ocurrió un error al intentar ingresar el carro',
				});
			});
	})
	.get('/:id', async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		await storage
			.get(request.params.id)
			.then((result: object | null) => {
				result !== null ?
					response.json({ cart : result }) :
					response.json({
						error : 'Carro de compras no encontrado',
					});
			})
			.catch(err => {
				response.json({
					error : 'Ocurrió un error al intentar cargar el carro',
				});
			});
	})
	.get('/:id/productos', async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		await storage
			.get(request.params.id)
			.then((result: object | null) => {
				result !== null ?
					response.json({
						products : (result as Cart).products,
					}) :
					response.json({
						error : 'Carro de compras no encontrado',
					});
			})
			.catch(err => {
				response.json({
					error : 'Ocurrió un error al intentar cargar los productos del carro',
				});
			});
	})
	.post('/:id/productos', async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		const products: Array<CartProduct> = request.body.products.map((product: { id: string, amount?: string }) => ({ id : product.id, amount : Number(product.amount) }));
		await storage
			.addToCart(request.params.id, products)
			.then((result: Cart | null | boolean) => {
				if(result !== false) {
					if(result === null) {
						response.json({
							error : 'Carro de compras no encontrado',
						});
					} else {
						response.json({
							message : 'Productos agregados al carro con éxito',
							cart    : result
						})
					}
				} else {
					response.json({
						error : 'Ocurrió un error al intentar editar el registro',
					});
				}
			})
			.catch(err => {
				response.json({
					error : 'Ocurrió un error al intentar agregar el producto el carro',
				});
			});
	})
	.delete('/:id/productos/:product_id', async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		await storage
			.removeFromCart(request.params.id, request.params.product_id)
			.then((result: Cart | null | boolean) => {
				if(result !== false) {
					if(result === null) {
						response.json({
							error : 'Carro de compras no encontrado',
						});
					} else {
						response.json({
							message : 'Producto eliminado al carro con éxito',
							cart    : result
						})
					}
				} else {
					response.json({
						error : 'Ocurrió un error al intentar editar el registro',
					});
				}
			})
			.catch(err => {
				response.json({
					error : 'Ocurrió un error al intentar eliminar el producto del carro',
				});
			});
	})
	.delete('/:id', async (request: Request, response: Response) => {
		response.setHeader('Content-Type', 'application/json; charset=UTF-8');
		await storage
			.remove(request.params.id)
			.then((result: boolean | null) => {
				if(result !== false) {
					if(result === null) {
						response.json({
							error : 'Carro de compras no encontrado',
						});
					} else {
						response.json({
							message : 'Carro de compras eliminado con éxito',
						})
					}
				} else {
					response.json({
						error : 'Ocurrió un error al intentar eliminar el registro',
					});
				}
			})
			.catch(err => {
				response.json({
					error : 'Ocurrió un error al intentar eliminar el carro',
				});
			});
	});

export default routes;