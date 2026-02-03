
import { Player, BoardState, Position } from '../types.ts';
import { BOARD_SIZE } from '../constants.ts';

// 方向ベクトル (8方向)
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

export const createInitialBoard = (): BoardState => {
  const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(Player.NONE));
  // 初期配置
  board[3][3] = Player.WHITE;
  board[3][4] = Player.BLACK;
  board[4][3] = Player.BLACK;
  board[4][4] = Player.WHITE;
  return board;
};

/**
 * 特定の方向に挟める石があるか確認し、あればそのリストを返す
 */
const getFlippableInDirection = (
  board: BoardState,
  row: number,
  col: number,
  dr: number,
  dc: number,
  player: Player
): Position[] => {
  const opponent = player === Player.BLACK ? Player.WHITE : Player.BLACK;
  const flippable: Position[] = [];
  
  let currR = row + dr;
  let currC = col + dc;

  while (currR >= 0 && currR < BOARD_SIZE && currC >= 0 && currC < BOARD_SIZE) {
    const cell = board[currR][currC];
    if (cell === opponent) {
      flippable.push({ r: currR, c: currC });
    } else if (cell === player) {
      return flippable; // 自分の石で終われば挟めている
    } else {
      break; // 空白なら挟めていない
    }
    currR += dr;
    currC += dc;
  }
  
  return []; // 挟めていない
};

/**
 * 全方向で挟める石のリストを取得する
 */
const getAllFlippable = (board: BoardState, r: number, c: number, player: Player): Position[] => {
  if (board[r][c] !== Player.NONE) return [];
  
  let allFlippable: Position[] = [];
  for (const [dr, dc] of DIRECTIONS) {
    const flippable = getFlippableInDirection(board, r, c, dr, dc, player);
    allFlippable = allFlippable.concat(flippable);
  }
  return allFlippable;
};

export const isValidMove = (board: BoardState, r: number, c: number, player: Player): boolean => {
  // すでに石がある場所には置けない
  if (board[r][c] !== Player.NONE) return false;
  // 少なくとも1つは石を裏返せる場所でなければならない
  for (const [dr, dc] of DIRECTIONS) {
    if (getFlippableInDirection(board, r, c, dr, dc, player).length > 0) {
      return true;
    }
  }
  return false;
};

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

export const applyMove = (board: BoardState, r: number, c: number, player: Player): BoardState => {
  const newBoard = board.map(row => [...row]);
  const flippable = getAllFlippable(board, r, c, player);
  
  // 石を置く
  newBoard[r][c] = player;
  
  // 石を裏返す
  for (const pos of flippable) {
    newBoard[pos.r][pos.c] = player;
  }
  
  return newBoard;
};

export const countPieces = (board: BoardState) => {
  let black = 0, white = 0;
  board.forEach(row => row.forEach(cell => {
    if (cell === Player.BLACK) black++;
    if (cell === Player.WHITE) white++;
  }));
  return { black, white };
};
