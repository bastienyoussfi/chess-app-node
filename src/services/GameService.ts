import { Game } from '../models/Game';
import Move from '../interfaces/move';
import GameState from '../interfaces/game-state';

export class GameService {
  private game: Game;

  constructor() {
    this.game = new Game();
  }

  getGameState(): GameState {
    return this.game.getGameState();
  }

  makeMove(move: Move) {
    const success = this.game.makeMove(move);
    return {
      success,
      gameState: this.getGameState()
    };
  }

  resetGame() {
    this.game.reset();
    return this.getGameState();
  }

  undoLastMove() {
    const success = this.game.undoLastMove();
    return {
      success,
      gameState: this.getGameState()
    };
  }

  updateTime(color: 'white' | 'black', timeSpent: number) {
    this.game.updateTime(color, timeSpent);
    return this.getGameState();
  }
}