import { Game } from '../models/Game';
import { Move } from '../types';

export class GameService {
  private game: Game;

  constructor() {
    this.game = new Game();
  }

  getGameState() {
    return {
      board: this.game.getBoard(),
      moveHistory: this.game.getMoveHistory()
    };
  }

  makeMove(move: Move) {
    const success = this.game.makeMove(move);
    return {
      success,
      ...this.getGameState()
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
      ...this.getGameState()
    };
  }
}