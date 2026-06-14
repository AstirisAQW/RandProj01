export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type GameDifficulty = 'beginner' | 'intermediate' | 'expert';

export interface DifficultyConfig {
  difficultyName: string;
  numberOfRows: number;
  numberOfColumns: number;
  mineCount: number;
}