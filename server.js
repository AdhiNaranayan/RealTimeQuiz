const http = require('http');
const socketio = require('socket.io');
const app = require('./server/app');
const gameSocket = require('./server/sockets/gameSocket');

const server = http.createServer(app);
const io = socketio(server);

gameSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
