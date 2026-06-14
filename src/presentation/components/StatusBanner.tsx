import type { GameStatus } from '../../domain/entities/Game';

interface StatusBannerProps {
  gameStatus: GameStatus;
  elapsedSeconds: number;
}

export default function StatusBanner({ gameStatus, elapsedSeconds }: StatusBannerProps) {
  if (gameStatus !== 'won' && gameStatus !== 'lost') return null;

  return (
    <div className={`
      px-6 py-3 text-lg font-bold uppercase tracking-widest border-2
      ${gameStatus === 'won'
        ? 'bg-green-200 border-green-600 text-green-800'
        : 'bg-red-200 border-red-600 text-red-800'
      }
    `}>
      {gameStatus === 'won' ? `You won in ${elapsedSeconds}s!` : 'Game over!'}
    </div>
  );
}