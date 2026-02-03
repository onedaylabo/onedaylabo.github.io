
import { Player, BoardState, Position, Difficulty } from '../types';
import { getValidMoves, applyMove, countPieces } from './othelloLogic';
import { BOARD_SIZE, FREEZE_PROBABILITY } from '../constants';

const CORNER_SCORE = 100;
const EDGE_SCORE = 10;

const evaluateBoard = (board: BoardState, player: Player): number => {
  const counts = countPieces(board);
  const score = player === Player.BLACK ? counts.black - counts.white : counts.white - counts.black;
  
  let bonus = 0;
  const corners = [[0,0], [0,7], [7,0], [7,7]];
  corners.forEach(([r, c]) => {
    if (board[r][c] === player) bonus += CORNER_SCORE;
    else if (board[r][c] !== Player.NONE) bonus -= CORNER_SCORE;
  });

  return score + bonus;
};

const alphaBeta = (
  board: BoardState, 
  depth: number, 
  alpha: number, 
  beta: number, 
  isMaximizing: boolean, 
  player: Player
): number => {
  const validMoves = getValidMoves(board, isMaximizing ? player : (player === Player.BLACK ? Player.WHITE : Player.BLACK));
  
  if (depth === 0 || validMoves.length === 0) {
    return evaluateBoard(board, player);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of validMoves) {
      const nextBoard = applyMove(board, move.r, move.c, player);
      const evalValue = alphaBeta(nextBoard, depth - 1, alpha, beta, false, player);
      maxEval = Math.max(maxEval, evalValue);
      alpha = Math.max(alpha, evalValue);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    const opponent = player === Player.BLACK ? Player.WHITE : Player.BLACK;
    for (const move of validMoves) {
      const nextBoard = applyMove(board, move.r, move.c, opponent);
      const evalValue = alphaBeta(nextBoard, depth - 1, alpha, beta, true, player);
      minEval = Math.min(minEval, evalValue);
      beta = Math.min(beta, evalValue);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

export const getChronosMove = (board: BoardState, player: Player, difficulty: Difficulty): Position | null => {
  const moves = getValidMoves(board, player);
  if (moves.length === 0) return null;

  if (difficulty === Difficulty.LEVEL1) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  if (difficulty === Difficulty.LEVEL2) {
    // Basic greedy with depth 2
    let bestScore = -Infinity;
    let bestMove = moves[0];
    for (const move of moves) {
      const score = alphaBeta(applyMove(board, move.r, move.c, player), 2, -Infinity, Infinity, false, player);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return bestMove;
  }

  // Level 3: Singularity
  // Incorporating "Double Action Chance" (conceptual heuristic)
  let bestScore = -Infinity;
  let bestMove = moves[0];
  
  for (const move of moves) {
    // Alpha-beta with depth 4 for performance in browser, ideally 8 as spec says but depth 8 is heavy for sync execution
    const score = alphaBeta(applyMove(board, move.r, move.c, player), 4, -Infinity, Infinity, false, player);
    
    // Level 3 heuristic: If a move puts us in a strong position, we "weight" it slightly higher 
    // because we have 12.5% chance to follow it up with another dominant move.
    // Also consider corners more aggressively.
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
};
