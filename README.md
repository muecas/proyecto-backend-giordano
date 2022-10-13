# Backend Project App

Products API endpoints:

- `GET: /api/productos` Get all products
- `GET: /api/productos/:id` - Get a product by ID
- `POST: /api/productos` - Adds a product; expected `json` body: `{ name: string, description: string, price: number, stock: number, thumbnail: PathLike, sku: string }` *
- `PUT: /api/productos/:id` - Updates a product by ID; expected `json` body: `{ name: string, description: string, price: number, stock: number, thumbnail: PathLike, sku: string }` *
- `DELETE: /api/productos/:id` - Deleted a product by ID *

Cart API endpoints:

- `POST: /api/carrito` Creates a new cart instance
- `GET: /api/carrito/:id` - Get a cart by ID
- `DELETE: /api/carrito/:id` - Deletes a cart by ID
- `GET: /api/carrito/:id/productos` - Get cart products
- `POST: /api/carrito/:id/productos` - Adds products to cart; expected `json` body: `{ products: [{ id: string, amount: number }, ...] }`
- `DELETE: /api/carrito/:id/productos/:productId` - Deletes a product from cart by product ID

Endpoints marked with * are admin only available. Change the hardcoded option from `src/config/config.ts`: `config.IS_ADMIN` to `true` to enable admin only endpoints. Otherwise, 401 errors will be thrown.