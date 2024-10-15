import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupGameHandlers } from './socketHandlers/GameHandlers';
import { CONFIG } from './config';

const app = express();
app.use(cors());

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
    console.log('User disconnected');
  });
});

server.listen(CONFIG.PORT, () => {
  console.log(`Server is running on port ${CONFIG.PORT}`);
});