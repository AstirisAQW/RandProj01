import type { Grid } from '../../domain/entities/Cell';
import type { GameDifficulty, GameStatus } from '../../domain/entities/Game';
import { DIFFICULTY_SETTINGS } from '../../presentation/constants/difficultySettings';
import {
  createEmptyGrid,
  buildGridWithMines,
  floodFillReveal,
  checkWinCondition,
  revealAllMines,
  markDeathMine,
  toggleFlag,
} from '../../domain/services/gridService';

export interface RevealCellResult {
  grid: Grid;
  nextStatus: GameStatus;
  shouldStartTimer: boolean;
}

export function startNewGameAction(difficulty: GameDifficulty): Grid {
  const { numberOfRows, numberOfColumns } = DIFFICULTY_SETTINGS[difficulty];
  return createEmptyGrid(numberOfRows, numberOfColumns);
}

export function revealCellAction(
  grid: Grid,
  clickedRow: number,
  clickedColumn: number,
  currentStatus: GameStatus,
  difficulty: GameDifficulty,
): RevealCellResult {
  const { numberOfRows, numberOfColumns, mineCount } = DIFFICULTY_SETTINGS[difficulty];
  const clickedCell = grid[clickedRow][clickedColumn];

  if (clickedCell.isRevealed || clickedCell.isFlagged) {
    return { grid, nextStatus: currentStatus, shouldStartTimer: false };
  }

  // First click: safe mine placement + flood fill
  if (currentStatus === 'idle') {
    const withMines = buildGridWithMines(grid, numberOfRows, numberOfColumns, mineCount, clickedRow, clickedColumn);
    const revealed = floodFillReveal(withMines, clickedRow, clickedColumn, numberOfRows, numberOfColumns);
    const won = checkWinCondition(revealed, mineCount);
    return { grid: revealed, nextStatus: won ? 'won' : 'playing', shouldStartTimer: true };
  }

  // Hit a mine
  if (clickedCell.isThereMine) {
    const allMinesRevealed = revealAllMines(grid);
    const withDeath = markDeathMine(allMinesRevealed, clickedRow, clickedColumn);
    return { grid: withDeath, nextStatus: 'lost', shouldStartTimer: false };
  }

  // Safe cell reveal
  const revealed = floodFillReveal(grid, clickedRow, clickedColumn, numberOfRows, numberOfColumns);
  const won = checkWinCondition(revealed, mineCount);
  return { grid: revealed, nextStatus: won ? 'won' : currentStatus, shouldStartTimer: false };
}

export function flagCellAction(
  grid: Grid,
  row: number,
  col: number,
): ReturnType<typeof toggleFlag> {
  return toggleFlag(grid, row, col);
}