import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { CONFIG } from './config';
import { setupGameHandlers } from './socketHandlers/GameHandlers';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CONFIG.CORS_ORIGIN,
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  setupGameHandlers(io, socket);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(CONFIG.PORT, () => {
  console.log(`Server is running on port ${CONFIG.PORT}`);
});