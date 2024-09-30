import Board from '../types/board';
import Move from '../interfaces/move';
import Piece from '../interfaces/piece';
import GameState from '../interfaces/game-state';
import { cloneBoard } from '../utils/board-utils';
import { initialBoard } from '../utils/board-utils';
import { isCheck } from '../utils/move-validation';
import { isCheckmate } from '../utils/move-validation';
import { isStalemate } from '../utils/move-validation';
import { isValidMove } from '../utils/move-validation';
import { makeMove } from '../utils/move-validation';

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

  getBoard(): Board {
    return this.board;
  }

  getMoveHistory(): Move[] {
    return this.moveHistory;
  }

  getCurrentPlayer(): 'white' | 'black' {
    return this.currentPlayer;
  }

  getCapturedPieces(): { white: Piece[], black: Piece[] } {
    return this.capturedPieces;
  }

  getTimeRemaining(): { white: number, black: number } {
    return this.timeRemaining;
  }

  getGameState(): GameState {
    return {
      board: this.getBoard(),
      moveHistory: this.getMoveHistory(),
      currentPlayer: this.getCurrentPlayer(),
      isCheck: isCheck(this.board, this.currentPlayer),
      isCheckmate: isCheckmate(this.board, this.currentPlayer),
      isStalemate: isStalemate(this.board, this.currentPlayer),
      capturedPieces: this.getCapturedPieces(),
      timeRemaining: this.getTimeRemaining(),
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
    
    // Remove the last captured piece if there was one
    const lastCapturedPiece = this.capturedPieces[this.currentPlayer].pop();
    if (lastCapturedPiece) {
      this.board[lastMove.to.row][lastMove.to.col] = lastCapturedPiece;
    }
    
    return true;
  }

  updateTime(color: 'white' | 'black', timeSpent: number): void {
    this.timeRemaining[color] -= timeSpent;
    if (this.timeRemaining[color] < 0) {
      this.timeRemaining[color] = 0;
    }
  }
}