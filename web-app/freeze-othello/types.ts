
export enum Player {
  NONE = 0,
  BLACK = 1, // Obsidian Black (黒)
  WHITE = 2  // Luna Ceramic (白)
}

export type BoardState = Player[][];

export interface Position {
  r: number;
  c: number;
}

export enum GameState {
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER',
  GLITCHING = 'GLITCHING'
}

export enum Difficulty {
  LEVEL1 = 'Level 1: 乱数試行',
  LEVEL2 = 'Level 2: 標準解析',
  LEVEL3 = 'Level 3: 特異点 (Singularity)'
}
