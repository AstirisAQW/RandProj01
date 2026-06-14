import type { GameDifficulty, DifficultyConfig } from '../../domain/entities/Game';
import { DIFFICULTY_SETTINGS } from '../constants/difficultySettings';

interface DifficultyToolbarProps {
  selectedDifficulty: GameDifficulty;
  onSelectDifficulty: (difficulty: GameDifficulty) => void;
}

export default function DifficultyToolbar({ selectedDifficulty, onSelectDifficulty }: DifficultyToolbarProps) {
  return (
    <div className="flex gap-2">
      {(Object.entries(DIFFICULTY_SETTINGS) as [GameDifficulty, DifficultyConfig][]).map(
        ([key, config]) => (
          <button
            key={key}
            onClick={() => onSelectDifficulty(key)}
            className={`
              px-4 py-2 text-sm font-bold border-2 uppercase tracking-wide
              ${selectedDifficulty === key
                ? 'bg-gray-200 border-t-gray-500 border-l-gray-500 border-b-gray-100 border-r-gray-100'
                : 'bg-gray-300 border-t-gray-100 border-l-gray-100 border-b-gray-500 border-r-gray-500 hover:bg-gray-250'
              }
            `}
          >
            {config.difficultyName}
          </button>
        )
      )}
    </div>
  );
}