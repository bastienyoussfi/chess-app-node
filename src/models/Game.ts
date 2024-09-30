import { Board, Move } from '../types';
import { cloneBoard } from '../utils/BoardUtils';
import { initialBoard } from '../utils/BoardUtils';
import { isValidMove } from '../utils/MoveValidation';

export class Game {
  private board: Board;
  private moveHistory: Move[];

  constructor() {
    this.board = cloneBoard(initialBoard);
    this.moveHistory = [];
  }

  getBoard(): Board {
    return this.board;
  }

  getMoveHistory(): Move[] {
    return this.moveHistory;
  }

  makeMove(move: Move): boolean {
    if (isValidMove(this.board, move)) {
      const { from, to } = move;
      this.board[to.row][to.col] = this.board[from.row][from.col];
      this.board[from.row][from.col] = null;
      this.moveHistory.push(move);
      return true;
    }
    return false;
  }

  reset(): void {
    this.board = cloneBoard(initialBoard);
    this.moveHistory = [];
  }

  undoLastMove(): boolean {
    if (this.moveHistory.length === 0) {
      return false;
    }
    const lastMove = this.moveHistory.pop()!;
    const { from, to } = lastMove;
    this.board[from.row][from.col] = this.board[to.row][to.col];
    this.board[to.row][to.col] = null;
    return true;
  }
}