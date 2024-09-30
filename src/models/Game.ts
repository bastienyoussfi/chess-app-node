import { Board, Move } from '../types';
import { cloneBoard } from '../utils/BoardUtils';
import { initialBoard } from '../utils/BoardUtils';
import { isValidMove } from '../utils/MoveValidation';
import { makeMove } from '../utils/MoveValidation';
import { isCheck } from '../utils/MoveValidation';
import { isCheckmate } from '../utils/MoveValidation';
import { isStalemate } from '../utils/MoveValidation';
import { Piece } from '../types';
import { GameState } from '../types';

export class Game {
  private board: Board;
  private moveHistory: Move[];
  private currentPlayer: 'white' | 'black';
  private capturedPieces: { white: Piece[], black: Piece[] };
  private timeRemaining: { white: number, black: number };

  constructor() {
    this.board = cloneBoard(initialBoard);
    this.moveHistory = [];
    this.currentPlayer = 'white';
    this.capturedPieces = { white: [], black: [] };
    this.timeRemaining = { white: 600, black: 600 }; // 10 minutes per player
  }

  getGameState(): GameState {
    return {
      board: this.board,
      moveHistory: this.moveHistory,
      currentPlayer: this.currentPlayer,
      isCheck: isCheck(this.board, this.currentPlayer),
      isCheckmate: isCheckmate(this.board, this.currentPlayer),
      isStalemate: isStalemate(this.board, this.currentPlayer),
      capturedPieces: this.capturedPieces,
      timeRemaining: this.timeRemaining,
    };
  }

  makeMove(move: Move): boolean {
    if (isValidMove(this.board, move, this.currentPlayer)) {
      const capturedPiece = this.board[move.to.row][move.to.col];
      if (capturedPiece) {
        this.capturedPieces[capturedPiece.color].push(capturedPiece);
      }

      this.board = makeMove(this.board, move);
      this.moveHistory.push(move);
      this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
      return true;
    }
    return false;
  }

  reset(): void {
    this.board = cloneBoard(initialBoard);
    this.moveHistory = [];
    this.currentPlayer = 'white';
    this.capturedPieces = { white: [], black: [] };
    this.timeRemaining = { white: 600, black: 600 };
  }

  undoLastMove(): boolean {
    if (this.moveHistory.length === 0) {
      return false;
    }
    const lastMove = this.moveHistory.pop()!;
    this.board = makeMove(this.board, { from: lastMove.to, to: lastMove.from });
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    return true;
  }

  updateTime(color: 'white' | 'black', timeSpent: number): void {
    this.timeRemaining[color] -= timeSpent;
    if (this.timeRemaining[color] < 0) {
      this.timeRemaining[color] = 0;
    }
  }
}