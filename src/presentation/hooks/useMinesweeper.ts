import { useState, useEffect, useRef, useCallback } from 'react';
import type { Grid } from '../../domain/entities/Cell';
import type { GameDifficulty, GameStatus } from '../../domain/entities/Game';
import { DIFFICULTY_SETTINGS } from '../constants/difficultySettings';
import { startNewGameAction, revealCellAction, flagCellAction } from '../../application/useCases/gameActions';

export function useMinesweeper() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>('beginner');
  const [grid, setGrid] = useState<Grid>(() =>
    startNewGameAction('beginner')
  );
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [flagsPlaced, setFlagsPlaced] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') stopTimer();
  }, [gameStatus, stopTimer]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  const startNewGame = useCallback((difficulty: GameDifficulty) => {
    stopTimer();
    setSelectedDifficulty(difficulty);
    setGrid(startNewGameAction(difficulty));
    setGameStatus('idle');
    setFlagsPlaced(0);
    setElapsedSeconds(0);
  }, [stopTimer]);

  const handleCellLeftClick = useCallback((row: number, col: number) => {
    if (gameStatus === 'won' || gameStatus === 'lost') return;

    setGrid(currentGrid => {
      const result = revealCellAction(currentGrid, row, col, gameStatus, selectedDifficulty);
      if (result.shouldStartTimer) startTimer();
      setGameStatus(result.nextStatus);
      return result.grid;
    });
  }, [gameStatus, selectedDifficulty, startTimer]);

  const handleCellRightClick = useCallback((event: React.MouseEvent, row: number, col: number) => {
    event.preventDefault();
    if (gameStatus === 'won' || gameStatus === 'lost' || gameStatus === 'idle') return;

    const cell = grid[row][col];
    if (cell.isRevealed) return;

    const { grid: updatedGrid, flagDelta } = flagCellAction(grid, row, col);
    setGrid(updatedGrid);
    setFlagsPlaced(prev => prev + flagDelta);
  }, [gameStatus, grid]);

  const activeDifficultyConfig = DIFFICULTY_SETTINGS[selectedDifficulty];
  const remainingMineCount = activeDifficultyConfig.mineCount - flagsPlaced;
  const displaySeconds = Math.min(elapsedSeconds, 999);

  return {
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
  };
}