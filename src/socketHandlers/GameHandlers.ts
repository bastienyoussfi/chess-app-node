import { Server, Socket } from 'socket.io';
import { GameController } from '../controllers/GameController';
import { Move } from '../types';

export function setupGameHandlers(io: Server, socket: Socket) {
  const gameController = new GameController();

  function emitGameState() {
    io.emit('gameState', gameController.getGameState());
  }

  // Initial game state
  emitGameState();

  socket.on('movePiece', (move: Move) => {
    const result = gameController.handleMove(move);
    if (result.success) {
      emitGameState();
    } else {
      socket.emit('invalidMove');
    }
  });

  socket.on('resetGame', () => {
    gameController.handleReset();
    emitGameState();
  });

  socket.on('undoMove', () => {
    const result = gameController.handleUndo();
    if (result.success) {
      emitGameState();
    } else {
      socket.emit('undoFailed');
    }
  });

  socket.on('getGameState', () => {
    socket.emit('gameState', gameController.getGameState());
  });
}