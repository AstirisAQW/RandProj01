import { useMinesweeper } from './hooks/useMinesweeper';
import DifficultyToolbar from './components/DifficultyToolbar';
import MinesweeperHud from './components/MinesweeperHud';
import MinesweeperCell from './components/MinesweeperCell';
import StatusBanner from './components/StatusBanner';

export default function Minesweeper() {
  const {
    grid,
    gameStatus,
    selectedDifficulty,
    activeDifficultyConfig,
    remainingMineCount,
    displaySeconds,
    elapsedSeconds,
    startNewGame,
    handleCellLeftClick,
    handleCellRightClick,
  } = useMinesweeper();

  return (
    <div className="min-h-screen bg-gray-500 flex flex-col items-center justify-center p-6 gap-6">

      <DifficultyToolbar
        selectedDifficulty={selectedDifficulty}
        onSelectDifficulty={startNewGame}
      />

      <div className="bg-gray-300 border-4 border-t-gray-100 border-l-gray-100 border-b-gray-500 border-r-gray-500 p-3 inline-block">

        <MinesweeperHud
          remainingMineCount={remainingMineCount}
          displaySeconds={displaySeconds}
          gameStatus={gameStatus}
          selectedDifficulty={selectedDifficulty}
          onReset={() => startNewGame(selectedDifficulty)}
        />

        <div
          className="border-2 border-t-gray-500 border-l-gray-500 border-b-gray-100 border-r-gray-100"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${activeDifficultyConfig.numberOfColumns}, 2rem)`,
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <MinesweeperCell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                onClick={() => handleCellLeftClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleCellRightClick(e, rowIndex, colIndex)}
              />
            ))
          )}
        </div>
      </div>

      <StatusBanner gameStatus={gameStatus} elapsedSeconds={elapsedSeconds} />
    </div>
  );
}