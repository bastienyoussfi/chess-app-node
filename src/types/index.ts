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
  }