import type { GameDifficulty, GameStatus } from '../../domain/entities/Game';

interface HudProps {
  remainingMineCount: number;
  displaySeconds: number;
  gameStatus: GameStatus;
  selectedDifficulty: GameDifficulty;
  onReset: () => void;
}

function getStatusLabel(gameStatus: GameStatus): string {
  if (gameStatus === 'won') return 'win';
  if (gameStatus === 'lost') return 'lost';
  return '';
}

export default function MinesweeperHud({
  remainingMineCount,
  displaySeconds,
  gameStatus,
  selectedDifficulty,
  onReset,
}: HudProps) {
  return (
    <div className="flex items-center justify-between mb-3 bg-gray-400 border-2 border-t-gray-500 border-l-gray-500 border-b-gray-100 border-r-gray-100 p-2">

      {/* Mine counter */}
      <div className="bg-black text-red-500 font-mono text-2xl font-bold w-16 text-center px-1 py-0.5 tracking-widest">
        {String(remainingMineCount).padStart(3, '0')}
      </div>

      {/* Reset button */}
      <button
        onClick={onReset}
        className="
          w-10 h-10 text-xl flex items-center justify-center
          bg-gray-300 border-2
          border-t-gray-100 border-l-gray-100 border-b-gray-500 border-r-gray-500
          active:border-t-gray-500 active:border-l-gray-500 active:border-b-gray-100 active:border-r-gray-100
        "
        title="New game"
      >
        {getStatusLabel(gameStatus)}
      </button>

      {/* Timer */}
      <div className="bg-black text-red-500 font-mono text-2xl font-bold w-16 text-center px-1 py-0.5 tracking-widest">
        {String(displaySeconds).padStart(3, '0')}
      </div>
    </div>
  );
}