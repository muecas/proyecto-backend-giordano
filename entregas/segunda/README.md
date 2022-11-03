# API Ecommerce
## Inicialización APP

Para inicializar la aplicación utilice el siguiente comando:

`ts-node app.ts`

Por defecto la aplicación inicializa utilizando MongoDB como motor de base de datos. Para especificar las opciones de conexión se utilizan las variables de entorno `DB_URI` y `DB_NAME`, para especificar la uri del servidor y el nombre de la base de datos, de la siguiente manera:

`DB_URI=mongodb://localhost:27017 DB_NAME=ecommerce ts-node app.ts`

### Otras opciones de inicialización

Especificando `DB_ENGINE` se puede especificar el motor de base de datos de preferencia. Las opciones disponibles son:

- `mongo`
- `firebase`
- `mysql`
- `sqlite3`

Para inicializar la aplicación con un motor de base de datos específico (ej. Firebase):

`DB_ENGINE=firebase ts-node app.ts`

Para el caso de MySQL pueden especificarse las siguientes variables de entorno:

- `DB_HOST` para especificar el host, por defecto es `localhost`
- `DB_PORT` para especificar el puerto, por defecto es `3306`
- `DB_USER` para especificar el usuario, por defecto es `root`
- `DB_PASSWORD` para especificar la contraseña, por defecto es `muecas78`
- `DB_NAME` para especificar el nombre de la base de datos, por defecto es `coderhouse`

Para inicializar la aplicación utilizando como motor de base de datos MySQL:

`DB_ENGINE=mysql DB_HOST=localhost DB_PORT=puerto DB_NAME=nombrebasededatos DB_USER=usuario DB_PASSWORD=pass ts-node app.ts`

## Creación de tablas y colecciones

Para crear las tablas y colecciones necesarias para la aplicación utilizamos el script provisto (`create-tables.ts`). Para ejecutar este script definimos el motor de base de datos a utilizar (no es necesario para el caso de Firebase):

`DB_ENGINE=firebase ts-node create-tables.ts`

Las opciones disponibles para `DB_ENGINE` so las mismas que para el caso de inicialización de la aplicación.

## Endpoints

**Endpoints productos:**

- `GET: /api/productos` Toma todos los productos
- `GET: /api/productos/:id` - Toma un producto por ID
- `POST: /api/productos` - Agrega productos; espera un `json` en el cuerpo de la petición: `{ name: string, price: number, thumbnail: PathLike }` *
- `PUT: /api/productos/:id` - Actualiza un producto por ID; espera un `json` en el cuerpo de la petición: `{ name: string, price: number, thumbnail: PathLike }` *
- `DELETE: /api/productos/:id` - Elimina un producto por ID *

**Endpoints carros:**

- `POST: /api/carrito` Crea un nuevo carro
- `GET: /api/carrito/:id` - Toma un carro por ID
- `DELETE: /api/carrito/:id` - Elimina un carro por ID
- `GET: /api/carrito/:id/productos` - Toma los productos de un carro por ID
- `POST: /api/carrito/:id/productos` - Agrega productos a un carro por ID; espera un `json` en el cuerpo de la petición: `{ products: [{ id: string, amount: number }, ...] }`
- `DELETE: /api/carrito/:id/productos/:productId` - Elimina un producto del carro por ID de carro y producto

Los endpoints marcados con * están únicamente disponibles para usuarios administradores. Para habilitar o deshabilitar el rol, se debe modificar la opción en `src/config/config.ts`: `config.IS_ADMIN` a `true` o `false`. De otra manera la aplicación devolverá error 401 para estos endpoints.