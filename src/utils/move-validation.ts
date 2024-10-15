import Board from "../types/board";
import Move from "../interfaces/move";
import Piece from "../interfaces/piece";
import Position from "../interfaces/position";

export function isValidMove(board: Board, move: Move, currentPlayer: 'white' | 'black'): boolean {
  const { from, to } = move;
  const piece = board[from.row][from.col];
  if (!piece || piece.color !== currentPlayer) return false;

  if (board[to.row][to.col] && board[to.row][to.col]?.color === piece.color) {
    return false;
  }

  let isValid = false;

  switch (piece.type) {
    case 'P': isValid = isValidPawnMove(board, move, piece.color); break;
    case 'R': isValid = isValidRookMove(board, move); break;
    case 'N': isValid = isValidKnightMove(move); break;
    case 'B': isValid = isValidBishopMove(board, move); break;
    case 'Q': isValid = isValidQueenMove(board, move); break;
    case 'K': isValid = isValidKingMove(move); break;
  }

  if (isValid) {
    // Check if the move puts the current player in check
    const newBoard = makeMove(board, move);
    if (isCheck(newBoard, currentPlayer)) {
      return false;
    }
  }

  return isValid;
}

export function isCheck(board: Board, kingColor: 'white' | 'black'): boolean {
  const kingPosition = findKing(board, kingColor);
  const opponentColor = kingColor === 'white' ? 'black' : 'white';

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === opponentColor) {
        if (isValidMove(board, { from: { row, col }, to: kingPosition }, opponentColor)) {
          return true;
        }
      }
    }
  }
  return false;
}

export function isCheckmate(board: Board, currentPlayer: 'white' | 'black'): boolean {
  if (!isCheck(board, currentPlayer)) return false;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            const move = { from: { row, col }, to: { row: toRow, col: toCol } };
            if (isValidMove(board, move, currentPlayer)) {
              const newBoard = makeMove(board, move);
              if (!isCheck(newBoard, currentPlayer)) {
                return false;
              }
            }
          }
        }
      }
    }
  }
  return true;
}

export function isStalemate(board: Board, currentPlayer: 'white' | 'black'): boolean {
  if (isCheck(board, currentPlayer)) return false;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            const move = { from: { row, col }, to: { row: toRow, col: toCol } };
            if (isValidMove(board, move, currentPlayer)) {
              return false;
            }
          }
        }
      }
    }
  }
  return true;
}

export function makeMove(board: Board, move: Move): Board {
  const newBoard = JSON.parse(JSON.stringify(board));
  const piece = newBoard[move.from.row][move.from.col];
  newBoard[move.to.row][move.to.col] = piece;
  newBoard[move.from.row][move.from.col] = null;

  // Handle pawn promotion
  if (piece.type === 'P' && (move.to.row === 0 || move.to.row === 7)) {
    newBoard[move.to.row][move.to.col] = { ...piece, type: move.promotion || 'Q' };
  }

  // TODO: Handle castling and en passant

  return newBoard;
}

function findKing(board: Board, color: 'white' | 'black'): Position {
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