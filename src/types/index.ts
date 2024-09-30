export interface Piece {
  color: 'white' | 'black';
  type: 'P' | 'R' | 'N' | 'B' | 'Q' | 'K';
}

export type Board = (Piece | null)[][];

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  promotion?: 'Q' | 'R' | 'B' | 'N';
}

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