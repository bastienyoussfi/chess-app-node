import { Board, Position } from '../types';


export const initialBoard: Board = [
  [
    { color: 'black', type: 'R' },
    { color: 'black', type: 'N' },
    { color: 'black', type: 'B' },
    { color: 'black', type: 'Q' },
    { color: 'black', type: 'K' },
    { color: 'black', type: 'B' },
    { color: 'black', type: 'N' },
    { color: 'black', type: 'R' },
  ],
  Array(8).fill({ color: 'black', type: 'P' }),
  ...Array(4).fill(Array(8).fill(null)),
  Array(8).fill({ color: 'white', type: 'P' }),
  [
    { color: 'white', type: 'R' },
    { color: 'white', type: 'N' },
    { color: 'white', type: 'B' },
    { color: 'white', type: 'Q' },
    { color: 'white', type: 'K' },
    { color: 'white', type: 'B' },
    { color: 'white', type: 'N' },
    { color: 'white', type: 'R' },
  ],
];

export function cloneBoard(board: Board): Board {
  return JSON.parse(JSON.stringify(board));
}

export function findKing(board: Board, color: 'white' | 'black'): Position {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'K' && piece.color === color) {
        return { row, col };
      }
    }
  }
  throw new Error(`${color} king not found`);
}