import type { Cell, Grid } from '../entities/Cell';

export function createEmptyGrid(numberOfRows: number, numberOfColumns: number): Grid {
  return Array.from({ length: numberOfRows }, () =>
    Array.from({ length: numberOfColumns }, () => ({
      isThereMine: false,
      isRevealed: false,
      isFlagged: false,
      howManyAdjacentMines: 0,
    }))
  );
}

export function buildGridWithMines(
  emptyGrid: Grid,
  numberOfRows: number,
  numberOfColumns: number,
  mineCount: number,
  safeRow: number,
  safeColumn: number,
): Grid {
  const grid = emptyGrid.map(row => row.map(cell => ({ ...cell })));

  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const row = Math.floor(Math.random() * numberOfRows);
    const col = Math.floor(Math.random() * numberOfColumns);

    if ((row === safeRow && col === safeColumn) || grid[row][col].isThereMine) continue;

    grid[row][col].isThereMine = true;
    minesPlaced++;
  }

  for (let row = 0; row < numberOfRows; row++) {
    for (let col = 0; col < numberOfColumns; col++) {
      if (grid[row][col].isThereMine) continue;

      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = row + dr;
          const nc = col + dc;
          if (nr >= 0 && nr < numberOfRows && nc >= 0 && nc < numberOfColumns && grid[nr][nc].isThereMine) {
            count++;
          }
        }
      }
      grid[row][col].howManyAdjacentMines = count;
    }
  }

  return grid;
}

export function floodFillReveal(
  gridSnapshot: Grid,
  startRow: number,
  startColumn: number,
  numberOfRows: number,
  numberOfColumns: number,
): Grid {
  const grid = gridSnapshot.map(row => row.map(cell => ({ ...cell })));

  const stack: [number, number][] = [[startRow, startColumn]];
  const visited = new Set<string>([`${startRow}-${startColumn}`]);

  while (stack.length > 0) {
    const [row, col] = stack.pop()!;
    const cell = grid[row][col];

    if (cell.isFlagged || cell.isRevealed || cell.isThereMine) continue;

    grid[row][col] = { ...cell, isRevealed: true };

    if (cell.howManyAdjacentMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = row + dr;
          const nc = col + dc;
          const key = `${nr}-${nc}`;
          if (
            nr >= 0 && nr < numberOfRows &&
            nc >= 0 && nc < numberOfColumns &&
            !visited.has(key)
          ) {
            const neighbor = grid[nr][nc];
            if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isThereMine) {
              stack.push([nr, nc]);
              visited.add(key);
            }
          }
        }
      }
    }
  }

  return grid;
}

export function checkWinCondition(grid: Grid, totalMineCount: number): boolean {
  const totalCells = grid.length * grid[0].length;
  const revealedCells = grid.flat().filter(cell => cell.isRevealed).length;
  return revealedCells === totalCells - totalMineCount;
}

export function revealAllMines(gridSnapshot: Grid): Grid {
  return gridSnapshot.map(row =>
    row.map(cell => (cell.isThereMine ? { ...cell, isRevealed: true } : cell))
  );
}

export function markDeathMine(grid: Grid, deathRow: number, deathColumn: number): Grid {
  return grid.map((row, ri) =>
    row.map((cell, ci) =>
      ri === deathRow && ci === deathColumn ? { ...cell, isDeathMine: true } : cell
    )
  );
}

export function toggleFlag(grid: Grid, row: number, col: number): { grid: Grid; flagDelta: number } {
  const cell = grid[row][col];
  const nowFlagged = !cell.isFlagged;
  const updated = grid.map((r, ri) =>
    r.map((c, ci) =>
      ri === row && ci === col ? { ...c, isFlagged: nowFlagged } : c
    )
  );
  return { grid: updated, flagDelta: nowFlagged ? 1 : -1 };
}