import { Board, Move, Piece } from '../types';

export function isValidMove(board: Board, move: Move): boolean {
  const { from, to } = move;
  const piece = board[from.row][from.col];
  if (!piece) return false;

  // Check if the destination is occupied by a piece of the same color
  if (board[to.row][to.col] && board[to.row][to.col]?.color === piece.color) {
    return false;
  }

  switch (piece.type) {
    case 'P': return isValidPawnMove(board, move, piece.color);
    case 'R': return isValidRookMove(board, move);
    case 'N': return isValidKnightMove(move);
    case 'B': return isValidBishopMove(board, move);
    case 'Q': return isValidQueenMove(board, move);
    case 'K': return isValidKingMove(move);
    default: return false;
  }
}

function isValidPawnMove(board: Board, move: Move, color: Piece['color']): boolean {
  const { from, to } = move;
  const direction = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;

  // Move forward
  if (from.col === to.col && board[to.row][to.col] === null) {
    if (to.row === from.row + direction) return true;
    if (from.row === startRow && to.row === from.row + 2 * direction && board[from.row + direction][from.col] === null) return true;
  }

  // Capture diagonally
  if (Math.abs(to.col - from.col) === 1 && to.row === from.row + direction) {
    return board[to.row][to.col] !== null;
  }

  return false;
}

function isValidRookMove(board: Board, move: Move): boolean {
  const { from, to } = move;
  if (from.row !== to.row && from.col !== to.col) return false;

  const rowStep = Math.sign(to.row - from.row);
  const colStep = Math.sign(to.col - from.col);

  let currentRow = from.row + rowStep;
  let currentCol = from.col + colStep;

  while (currentRow !== to.row || currentCol !== to.col) {
    if (board[currentRow][currentCol] !== null) return false;
    currentRow += rowStep;
    currentCol += colStep;
  }

  return true;
}

function isValidKnightMove(move: Move): boolean {
  const { from, to } = move;
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);
  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

function isValidBishopMove(board: Board, move: Move): boolean {
  const { from, to } = move;
  if (Math.abs(to.row - from.row) !== Math.abs(to.col - from.col)) return false;

  const rowStep = Math.sign(to.row - from.row);
  const colStep = Math.sign(to.col - from.col);

  let currentRow = from.row + rowStep;
  let currentCol = from.col + colStep;

  while (currentRow !== to.row && currentCol !== to.col) {
    if (board[currentRow][currentCol] !== null) return false;
    currentRow += rowStep;
    currentCol += colStep;
  }

  return true;
}

function isValidQueenMove(board: Board, move: Move): boolean {
  return isValidRookMove(board, move) || isValidBishopMove(board, move);
}

function isValidKingMove(move: Move): boolean {
  const { from, to } = move;
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);
  return rowDiff <= 1 && colDiff <= 1;
}