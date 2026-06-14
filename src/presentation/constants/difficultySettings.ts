import type { GameDifficulty, DifficultyConfig } from '../../domain/entities/Game';

export const DIFFICULTY_SETTINGS: Record<GameDifficulty, DifficultyConfig> = {
  beginner: {
    difficultyName: 'Beginner',
    numberOfRows: 9,
    numberOfColumns: 9,
    mineCount: 10,
  },
  intermediate: {
    difficultyName: 'Intermediate',
    numberOfRows: 16,
    numberOfColumns: 16,
    mineCount: 40,
  },
  expert: {
    difficultyName: 'Expert',
    numberOfRows: 16,
    numberOfColumns: 30,
    mineCount: 99,
  },
};

export const ADJACENT_MINE_COLOURS: Record<number, string> = {
  1: 'text-blue-600',
  2: 'text-green-600',
  3: 'text-red-600',
  4: 'text-blue-900',
  5: 'text-red-900',
  6: 'text-teal-600',
  7: 'text-black',
  8: 'text-gray-500',
};