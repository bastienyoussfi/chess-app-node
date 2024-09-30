import { GameService } from '../services/GameService';
import Move from '../interfaces/move';

export class GameController {
  private gameService: GameService;

  constructor() {
    this.gameService = new GameService();
  }

  getGameState() {
    return this.gameService.getGameState();
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

  handleUpdateTime(color: 'white' | 'black', timeSpent: number) {
    return this.gameService.updateTime(color, timeSpent);
  }
}