import Board from "../types/board";
import Move from "../interfaces/move";
import Piece from "../interfaces/piece";

export interface GameState {
    board: Board;
    moveHistory: Move[];
    currentPlayer: 'white' | 'black';
    isCheck: boolean;
    isCheckmate: boolean;
    isStalemate: boolean;
    capturedPieces: { white: Piece[], black: Piece[] };
    timeRemaining: { white: number, black: number };
}

export default GameState;