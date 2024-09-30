import { GameService } from '../services/GameService';
import { Move } from '../types';

export class GameController {
  private gameService: GameService;

  constructor() {
    this.gameService = new GameService();
  }

  handleMove(move: Move) {
    return this.gameService.makeMove(move);
  }

  handleReset() {
    return this.gameService.resetGame();
  }

  handleUndo() {
    return this.gameService.undoLastMove();
  }

  getGameState() {
    return this.gameService.getGameState();
  }
}