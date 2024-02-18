//Finish V2.0.0
const Server = require('./models/server');

require('dotenv').config();
const server = new Server();
server.listen();