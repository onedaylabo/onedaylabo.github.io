
import { Player, BoardState, Position } from '../types';
import { BOARD_SIZE } from '../constants';

export const createInitialBoard = (): BoardState => {
  const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(Player.NONE));
  board[3][3] = Player.WHITE;
  board[3][4] = Player.BLACK;
  board[4][3] = Player.BLACK;
  board[4][4] = Player.WHITE;
  return board;
};

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

export const getValidMoves = (board: BoardState, player: Player): Position[] => {
  const moves: Position[] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (isValidMove(board, r, c, player)) {
        moves.push({ r, c });
      }
    }
  }
  return moves;
};

export const isValidMove = (board: BoardState, r: number, c: number, player: Player): boolean => {
  if (board[r][c] !== Player.NONE) return false;
  const opponent = player === Player.BLACK ? Player.WHITE : Player.BLACK;

  for (const [dr, dc] of DIRECTIONS) {
    let nr = r + dr;
    let nc = c + dc;
    let hasOpponentBetween = false;

    while (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
      if (board[nr][nc] === opponent) {
        hasOpponentBetween = true;
      } else if (board[nr][nc] === player) {
        if (hasOpponentBetween) return true;
        break;
      } else {
        break;
      }
      nr += dr;
      nc += dc;
    }
  }
  return false;
};

export const applyMove = (board: BoardState, r: number, c: number, player: Player): BoardState => {
  const newBoard = board.map(row => [...row]);
  newBoard[r][c] = player;
  const opponent = player === Player.BLACK ? Player.WHITE : Player.BLACK;

  for (const [dr, dc] of DIRECTIONS) {
    let nr = r + dr;
    let nc = c + dc;
    const piecesToFlip: Position[] = [];

    while (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
      if (board[nr][nc] === opponent) {
        piecesToFlip.push({ r: nr, c: nc });
      } else if (board[nr][nc] === player) {
        piecesToFlip.forEach(p => {
          newBoard[p.r][p.c] = player;
        });
        break;
      } else {
        break;
      }
      nr += dr;
      nc += dc;
    }
  }
  return newBoard;
};

export const countPieces = (board: BoardState) => {
  let black = 0;
  let white = 0;
  board.forEach(row => row.forEach(cell => {
    if (cell === Player.BLACK) black++;
    if (cell === Player.WHITE) white++;
  }));
  return { black, white };
};
