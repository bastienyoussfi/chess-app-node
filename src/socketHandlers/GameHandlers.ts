import { Server, Socket } from 'socket.io';
import { GameController } from '../controllers/GameController';
import Move from '../interfaces/move';

export function setupGameHandlers(io: Server, socket: Socket) {
  const gameController = new GameController();

  function emitGameState() {
    const gameState = gameController.getGameState();
    console.log('Emitting game state:', gameState);
    io.emit('gameState', gameState);
  }

  // Initial game state
  socket.on('getGameState', () => {
    emitGameState();
  });

  socket.on('movePiece', (move: Move) => {
    console.log('Received move:', move);
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

  socket.on('updateTime', (data: { color: 'white' | 'black', timeSpent: number } | null) => {
    if (data && typeof data === 'object' && 'color' in data && 'timeSpent' in data) {
      const { color, timeSpent } = data;
      gameController.handleUpdateTime(color, timeSpent);
      emitGameState();
    } else {
      console.error('Invalid updateTime payload:', data);
    }
  });

  // Emit initial game state
  emitGameState();
}