import Server from './src/services/Server/Server';

// Creates the server
const server: Server = new Server(process.env.PORT || 8080);

// Starts the server
server.start();