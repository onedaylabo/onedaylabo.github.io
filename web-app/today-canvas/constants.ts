
import { MoodConfig, StyleConfig } from './types';

export const MOODS: MoodConfig[] = [
  { value: 'HAPPY', label: '悦', emoji: '😊' },
  { value: 'NORMAL', label: '平', emoji: '😐' },
  { value: 'SAD', label: '哀', emoji: '😢' },
  { value: 'BUSY', label: '忙', emoji: '🤯' },
];

export const STYLES: StyleConfig[] = [
  { value: 'CINEMATIC', label: 'シネマティック', description: '映画のようなドラマチックなライティング' },
  { value: 'WATERCOLOR', label: '水彩画風', description: '柔らかく芸術的なテクスチャ' },
  { value: 'ILLUSTRATION', label: 'イラスト', description: '気品のあるデジタルアート' },
  { value: 'REALISTIC', label: '写真風', description: '自然で地に足のついた描写' },
  { value: 'ANIME', label: 'アニメ調', description: '鮮やかな色彩と繊細なライン' },
];

export const LOADING_MESSAGES = [
  "今日という日の筆跡を辿っています...",
  "4つの視点から、心の景色を切り取っています...",
  "空気の震えを色彩へと変えています...",
  "記憶の断片を、一枚の紙へと定着させています...",
  "静寂の中で、あなたの物語が色づき始めます..."
];
