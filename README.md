# Backend Project App

## Challenges

### Challenge #01
[desafios/01/index.js](desafios/01/index.js)

### Challenge #02
[desafios/02/app.ts](desafios/02/app.ts)

Run as `node app.js <options>`. Use the following options to create, get, delete or clear the records:

- **Create a record:** `node app.js create 'Title 1' 10 '/images/thubnail.jpg'`
- **Get a record by id:** `node app.js id 1`
- **Delete a record by id:** `node app.js delete 1`
- **Clear all records:** `node app.js clear`
- **List all records:** `node app.js list` or `node app.js`

### Challenge #03
[desafios/03/app.ts](desafios/03/app.ts)

### Challenge #04
[desafios/04/app.ts](desafios/04/app.ts)

API endpoints:

- `:GET /api/productos` - Get all products
- `:GET /api/productos/:id` - Get a product by ID
- `:POST /api/productos` - Adds a product; expected `json` body: `{ title: String, price: Number, thumbnail: String }`
- `:PUT /api/productos/:id` - Updates a product by ID; expected `json` body: `{ title: String, price: String | Number, thumbnail: String }`
- `:DELETE /api/productos/:id` - Deleted a product by ID

A simple form is available to add products at the server root ([http://localhost:8080](http://localhost:8080)).