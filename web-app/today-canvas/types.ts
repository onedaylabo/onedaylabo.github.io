
export type AppState = 'IDLE' | 'PROCESSING' | 'RESULT' | 'ERROR';

export type MoodType = 'HAPPY' | 'NORMAL' | 'SAD' | 'BUSY';

export type StyleType = 'REALISTIC' | 'ILLUSTRATION' | 'WATERCOLOR' | 'ANIME' | 'CINEMATIC';

export interface MoodConfig {
  value: MoodType;
  label: string;
  emoji: string;
}

export interface StyleConfig {
  value: StyleType;
  label: string;
  description: string;
}

export interface GenerationResult {
  imageUrl: string;
  interpretedPrompt: string;
  originalText: string;
}
