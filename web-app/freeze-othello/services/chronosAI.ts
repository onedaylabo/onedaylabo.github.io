
import { Player, BoardState, Position, Difficulty } from '../types.ts';
import { getValidMoves, applyMove, countPieces } from './othelloLogic.ts';
import { BOARD_SIZE } from '../constants.ts';

// 重み付けマップ（角を重視する古典的な評価）
const WEIGHTS = [
  [100, -20, 10,  5,  5, 10, -20, 100],
  [-20, -50, -2, -2, -2, -2, -50, -20],
  [ 10,  -2,  5,  1,  1,  5,  -2,  10],
  [  5,  -2,  1,  0,  0,  1,  -2,   5],
  [  5,  -2,  1,  0,  0,  1,  -2,   5],
  [ 10,  -2,  5,  1,  1,  5,  -2,  10],
  [-20, -50, -2, -2, -2, -2, -50, -20],
  [100, -20, 10,  5,  5, 10, -20, 100]
];

const evaluateBoard = (board: BoardState, player: Player): number => {
  let score = 0;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === player) {
        score += WEIGHTS[r][c];
      } else if (board[r][c] !== Player.NONE) {
        score -= WEIGHTS[r][c];
      }
    }
  }
  return score;
};

export const getChronosMove = (board: BoardState, player: Player, difficulty: Difficulty): Position | null => {
  const moves = getValidMoves(board, player);
  if (moves.length === 0) return null;

  if (difficulty === Difficulty.LEVEL1) {
    // 完全にランダム
    return moves[Math.floor(Math.random() * moves.length)];
  }

  if (difficulty === Difficulty.LEVEL2) {
    // 取れる石の数が多い手を選ぶ
    let bestMove = moves[0];
    let maxFlip = -1;
    for (const move of moves) {
      const countsBefore = countPieces(board);
      const nextBoard = applyMove(board, move.r, move.c, player);
      const countsAfter = countPieces(nextBoard);
      const flipped = player === Player.BLACK 
        ? countsAfter.black - countsBefore.black 
        : countsAfter.white - countsBefore.white;
      
      if (flipped > maxFlip) {
        maxFlip = flipped;
        bestMove = move;
      }
    }
    return bestMove;
  }

  // Level 3: 簡易評価関数による最善手
  let bestMove = moves[0];
  let maxScore = -Infinity;
  for (const move of moves) {
    const nextBoard = applyMove(board, move.r, move.c, player);
    const score = evaluateBoard(nextBoard, player);
    if (score > maxScore) {
      maxScore = score;
      bestMove = move;
    }
  }
  return bestMove;
};
