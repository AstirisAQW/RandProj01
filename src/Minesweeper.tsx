import { useState, useEffect, useRef, useCallback } from 'react'
import './Minesweeper.css'

interface minesweeperCell {
  isThereMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  howManyAdjacentMines: number;
};

type gameStatus = 'idle' | 'playing' | 'won' | 'lost';

type gameDifficulty = 'beginner' | 'intermediate' | 'expert';

interface difficultyConfig {
  difficultyName: string;
  numberOfRows: number;
  numberOfColumns: number;
  mineCount: number;
}

const difficultySettings: Record<gameDifficulty, difficultyConfig> = {
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

function createEmptyGrid(
  numberOfRows: number, 
  numberOfColumns: number
): minesweeperCell[][]{
  return Array.from({ length: numberOfRows }, () =>
    Array.from({ length: numberOfColumns }, () => ({
      isThereMine: false,
      isRevealed: false,
      isFlagged: false,
      howManyAdjacentMines: 0,
    }))
  );
}

function buildGridWithMines(
  emptyGrid: minesweeperCell[][],
  numberOfRows: number,
  numberOfColumns: number,
  mineCount: number,
  row_noMineHereWhenClicked: number,
  column_noMineHereWhenClicked: number
): minesweeperCell[][]{
  const gridWithMines = emptyGrid.map(gridRow =>
    gridRow.map(gridCell => ({ ...gridCell }))
  );

  let minesPlaced = 0;
  while (minesPlaced < mineCount){
    const row_possibleMineInThisCell = Math.floor(Math.random()* numberOfRows);
    const column_possibleMineInThisCell = Math.floor(Math.random()*numberOfColumns);
    const thereIs_No_MineInThisCell = row_possibleMineInThisCell ===  row_noMineHereWhenClicked && column_possibleMineInThisCell === column_noMineHereWhenClicked;
    const thereIs_A_MineInThisCell = gridWithMines[row_possibleMineInThisCell][column_possibleMineInThisCell].isThereMine;
    if (thereIs_No_MineInThisCell || thereIs_A_MineInThisCell) continue;

    gridWithMines[row_possibleMineInThisCell][column_possibleMineInThisCell].isThereMine = true;
    minesPlaced++
  }

  // calculate how many mines are around each cell
  for (
    let row_currentCellBeingEvaluted = 0; 
    row_currentCellBeingEvaluted < numberOfRows; 
    row_currentCellBeingEvaluted++){
    for (
      let column_currentCellBeingEvaluted = 0; 
      column_currentCellBeingEvaluted < numberOfColumns; 
      column_currentCellBeingEvaluted++) {

      if (gridWithMines[row_currentCellBeingEvaluted][column_currentCellBeingEvaluted].isThereMine) continue;

      let count_howManyMinesAroundThisCell = 0;

      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let columnOffset = -1; columnOffset <= 1; columnOffset++) {

          const isCellNotNeighbor = rowOffset === 0 && columnOffset === 0;
          if (isCellNotNeighbor) continue;

          const neighborRow    = row_currentCellBeingEvaluted    + rowOffset;
          const neighborColumn = column_currentCellBeingEvaluted + columnOffset;

          const isInsideGrid =
            neighborRow    >= 0 && neighborRow    < numberOfRows &&
            neighborColumn >= 0 && neighborColumn < numberOfColumns;

          if (isInsideGrid && gridWithMines[neighborRow][neighborColumn].isThereMine) {
            count_howManyMinesAroundThisCell++;
          }
        }
      }
      gridWithMines[row_currentCellBeingEvaluted][column_currentCellBeingEvaluted].howManyAdjacentMines = count_howManyMinesAroundThisCell;
    }
  }
  return gridWithMines;
}

function revealNeighboringEmptyCells(
  gridSnapshot: minesweeperCell[][],
  startRow: number,
  startColumn: number,
  numberOfRows: number,
  numberOfColumns: number,
): minesweeperCell[][]{
  const updatedGrid = gridSnapshot.map(gridRow =>
    gridRow.map(gridCell => ({...gridCell}))
  );

//this stack has whats cells to visit
const stack_cellsToVisit: [number, number][] = [[startRow, startColumn]];
// trackss what cells are already queued to stop duplicates
const stack_visitedCells = new Set<string>();
stack_visitedCells.add(`${startRow}-${startColumn}`);

while (stack_cellsToVisit.length > 0){
    const [visitRow, visitColumn] = stack_cellsToVisit.pop()!;
    const visitedCell = updatedGrid[visitRow][visitColumn];
    //skip flagged cell, cell already revealed, or if cell is a mine
    if (visitedCell.isFlagged || visitedCell.isRevealed || visitedCell.isThereMine) continue;
    //reveal this cell
    updatedGrid[visitRow][visitColumn] = { ...visitedCell, isRevealed: true };
    // if cell has no mines around it then queue all 8 cells around it
    if (visitedCell.howManyAdjacentMines === 0) {
      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let columnOffset = -1; columnOffset <= 1; columnOffset++) {

          const isSelf = rowOffset === 0 && columnOffset === 0;
          if (isSelf) continue;

          const neighborRow    = visitRow    + rowOffset;
          const neighborColumn = visitColumn + columnOffset;

          const isInsideGrid =
            neighborRow    >= 0 && neighborRow    < numberOfRows &&
            neighborColumn >= 0 && neighborColumn < numberOfColumns;

          const neighborKey = `${neighborRow}-${neighborColumn}`;

          if (isInsideGrid && !stack_visitedCells.has(neighborKey)) {
            const neighborCell = updatedGrid[neighborRow][neighborColumn];
            // Only queue unrevealed, unflagged non-mines
            if (!neighborCell.isRevealed && !neighborCell.isFlagged && !neighborCell.isThereMine) {
              stack_cellsToVisit.push([neighborRow, neighborColumn]);
              stack_visitedCells.add(neighborKey);
            }
          }
        }
      }
    }
  }
  return updatedGrid;
}

function checkAllSafeCellsRevealed(
  gridSnapshot: minesweeperCell[][],
  totalMineCount: number
): boolean {
  const totalCells = gridSnapshot.length * gridSnapshot[0].length;
  const revealedCells = gridSnapshot
    .flat()
    .filter(gridCell => gridCell.isRevealed).length;
  return revealedCells === totalCells - totalMineCount;
}

function revealAllMines(gridSnapshot: minesweeperCell[][]): minesweeperCell[][] {
  return gridSnapshot.map(gridRow =>
    gridRow.map(gridCell =>
      gridCell.isThereMine ? { ...gridCell, isRevealed: true } : gridCell
    )
  );
}
const ADJACENT_MINE_COUNT_COLOURS: Record<number, string> = {
  1: 'text-blue-600',
  2: 'text-green-600',
  3: 'text-red-600',
  4: 'text-blue-900',
  5: 'text-red-900',
  6: 'text-teal-600',
  7: 'text-black',
  8: 'text-gray-500',
};



export default function Minesweeper() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<gameDifficulty>('beginner')
  const activeDifficultyConfig = difficultySettings[selectedDifficulty];

  const [grid, setGrid] = useState<minesweeperCell[][]>(() =>
    createEmptyGrid(
      difficultySettings.beginner.numberOfRows,
      difficultySettings.beginner.numberOfColumns
    )
  );

  const [gameStatus, setGameStatus] = useState<gameStatus>('idle');
  const [flagsPlaced, setFlagsPlaced]   = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) return; // already running
    timerIntervalRef.current = setInterval(() => {
      setElapsedSeconds(previousSeconds => previousSeconds + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  // Stop timer when game ends
  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      stopTimer();
    }
  }, [gameStatus, stopTimer]);
  // Clean up on unmount
  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  // ── Start a new game ────────────────────────────────────────────────────────
  const startNewGame = useCallback((difficultyName: gameDifficulty) => {
    stopTimer();
    setSelectedDifficulty(difficultyName);
    const config = difficultySettings[difficultyName];
    setGrid(createEmptyGrid(config.numberOfRows, config.numberOfColumns));
    setGameStatus('idle');
    setFlagsPlaced(0);
    setElapsedSeconds(0);
  }, [stopTimer]);

  // ── Left-click: reveal ──────────────────────────────────────────────────────
  const handleCellLeftClick = (clickedRow: number, clickedColumn: number) => {
    if (gameStatus === 'won' || gameStatus === 'lost') return;

    const clickedCell = grid[clickedRow][clickedColumn];
    if (clickedCell.isRevealed || clickedCell.isFlagged) return;

    const { numberOfRows, numberOfColumns, mineCount } = activeDifficultyConfig;

    if (gameStatus === 'idle') {
      // First click: place mines, start timer, then reveal
      startTimer();

      const gridAfterMinesPlaced = buildGridWithMines(
        grid,
        numberOfRows,
        numberOfColumns,
        mineCount,
        clickedRow,
        clickedColumn
      );

      // Flood-fill from the first click
      const gridAfterFirstReveal = revealNeighboringEmptyCells(
        gridAfterMinesPlaced,
        clickedRow,
        clickedColumn,
        numberOfRows,
        numberOfColumns
      );

      const playerWonOnFirstClick = checkAllSafeCellsRevealed(gridAfterFirstReveal, mineCount);
      setGrid(gridAfterFirstReveal);
      setGameStatus(playerWonOnFirstClick ? 'won' : 'playing');
      return;
    }

    // Subsequent clicks
    if (clickedCell.isThereMine) {
      // Hit a mine — game over
      const gridWithMinesRevealed = revealAllMines(grid);
      // Mark the clicked mine distinctly
      const gridWithDeathMarked = gridWithMinesRevealed.map((gridRow, rowIndex) =>
        gridRow.map((gridCell, columnIndex) =>
          rowIndex === clickedRow && columnIndex === clickedColumn
            ? { ...gridCell, isDeathMine: true }
            : gridCell
        )
      );
      setGrid(gridWithDeathMarked);
      setGameStatus('lost');
      return;
    }

    // Safe cell — flood-fill reveal
    const gridAfterReveal = revealNeighboringEmptyCells(
      grid,
      clickedRow,
      clickedColumn,
      numberOfRows,
      numberOfColumns
    );

    const playerHasWon = checkAllSafeCellsRevealed(gridAfterReveal, mineCount);
    setGrid(gridAfterReveal);
    if (playerHasWon) setGameStatus('won');
  };

  // ── Right-click: flag ───────────────────────────────────────────────────────
  const handleCellRightClick = (
    event: React.MouseEvent,
    clickedRow: number,
    clickedColumn: number
  ) => {
    event.preventDefault();
    if (gameStatus === 'won' || gameStatus === 'lost' || gameStatus === 'idle') return;

    const clickedCell = grid[clickedRow][clickedColumn];
    if (clickedCell.isRevealed) return;

    const cellIsNowFlagged = !clickedCell.isFlagged;

    setGrid(previousGrid => {
      const gridWithFlagToggled = previousGrid.map((gridRow, rowIndex) =>
        gridRow.map((gridCell, columnIndex) =>
          rowIndex === clickedRow && columnIndex === clickedColumn
            ? { ...gridCell, isFlagged: cellIsNowFlagged }
            : gridCell
        )
      );
      return gridWithFlagToggled;
    });

    setFlagsPlaced(previousFlagCount =>
      cellIsNowFlagged ? previousFlagCount + 1 : previousFlagCount - 1
    );
  };

  // ── Derived display values ──────────────────────────────────────────────────
  const remainingMineCount = activeDifficultyConfig.mineCount - flagsPlaced;
  const displaySeconds     = Math.min(elapsedSeconds, 999);

  // ── Face button emoji ───────────────────────────────────────────────────────
  const gameStatusText =
    gameStatus === 'won'  ? 'win' :
    gameStatus === 'lost' ? 'lost' :
    '';

  // ── Cell appearance ─────────────────────────────────────────────────────────
  const getCellContent = (gridCell: minesweeperCell & { isDeathMine?: boolean }) => {
    if (!gridCell.isRevealed) {
      return gridCell.isFlagged ? 'F' : '';
    }
    if (gridCell.isThereMine) {
      return (gridCell as any).isDeathMine ? '!!!' : 'X';
    }
    if (gridCell.howManyAdjacentMines === 0) return '';
    return String(gridCell.howManyAdjacentMines);
  };

  const getCellClassName = (gridCell: minesweeperCell & { isDeathMine?: boolean }) => {
    const baseClasses = 'w-8 h-8 flex items-center justify-center text-sm font-bold border select-none cursor-pointer';

    if (!gridCell.isRevealed) {
      return `${baseClasses} bg-gray-300 border-t-gray-100 border-l-gray-100 border-b-gray-500 border-r-gray-500 border-2 hover:bg-gray-250 active:bg-gray-400`;
    }

    if (gridCell.isThereMine) {
      const deathBackground = (gridCell as any).isDeathMine ? 'bg-red-500' : 'bg-gray-200';
      return `${baseClasses} ${deathBackground} border border-gray-400 cursor-default`;
    }

    const numberColour = ADJACENT_MINE_COUNT_COLOURS[gridCell.howManyAdjacentMines] ?? '';
    return `${baseClasses} bg-gray-200 border border-gray-400 cursor-default ${numberColour}`;
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-500 flex flex-col items-center justify-center p-6 gap-6">

      {/* Difficulty selector */}
      <div className="flex gap-2">
        {(Object.entries(difficultySettings) as [gameDifficulty, difficultyConfig][]).map(
          ([difficultyKey, difficultyConfig]) => (
            <button
              key={difficultyKey}
              onClick={() => startNewGame(difficultyKey)}
              className={`
                px-4 py-2 text-sm font-bold border-2 uppercase tracking-wide
                ${selectedDifficulty === difficultyKey
                  ? 'bg-gray-200 border-t-gray-500 border-l-gray-500 border-b-gray-100 border-r-gray-100'
                  : 'bg-gray-300 border-t-gray-100 border-l-gray-100 border-b-gray-500 border-r-gray-500 hover:bg-gray-250'
                }
              `}
            >
              {difficultyConfig.difficultyName}
            </button>
          )
        )}
      </div>

      {/* Game panel */}
      <div className="bg-gray-300 border-4 border-t-gray-100 border-l-gray-100 border-b-gray-500 border-r-gray-500 p-3 inline-block">

        {/* HUD: mine counter | face button | timer */}
        <div className="flex items-center justify-between mb-3 bg-gray-400 border-2 border-t-gray-500 border-l-gray-500 border-b-gray-100 border-r-gray-100 p-2">

          {/* Mine counter */}
          <div className="bg-black text-red-500 font-mono text-2xl font-bold w-16 text-center px-1 py-0.5 tracking-widest">
            {String(remainingMineCount).padStart(3, '0')}
          </div>

          {/* Face / reset button */}
          <button
            onClick={() => startNewGame(selectedDifficulty)}
            className="
              w-10 h-10 text-xl flex items-center justify-center
              bg-gray-300 border-2
              border-t-gray-100 border-l-gray-100 border-b-gray-500 border-r-gray-500
              active:border-t-gray-500 active:border-l-gray-500 active:border-b-gray-100 active:border-r-gray-100
            "
            title="New game"
          >
            {gameStatusText}
          </button>

          {/* Timer */}
          <div className="bg-black text-red-500 font-mono text-2xl font-bold w-16 text-center px-1 py-0.5 tracking-widest">
            {String(displaySeconds).padStart(3, '0')}
          </div>
        </div>

        {/* Grid */}
        <div
          className="border-2 border-t-gray-500 border-l-gray-500 border-b-gray-100 border-r-gray-100"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${activeDifficultyConfig.numberOfColumns}, 2rem)`,
          }}
        >
          {grid.map((gridRow, rowIndex) =>
            gridRow.map((gridCell, columnIndex) => (
              <button
                key={`${rowIndex}-${columnIndex}`}
                onClick={() => handleCellLeftClick(rowIndex, columnIndex)}
                onContextMenu={(event) => handleCellRightClick(event, rowIndex, columnIndex)}
                className={getCellClassName(gridCell as any)}
              >
                {getCellContent(gridCell as any)}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Status banner */}
      {(gameStatus === 'won' || gameStatus === 'lost') && (
        <div className={`
          px-6 py-3 text-lg font-bold uppercase tracking-widest border-2
          ${gameStatus === 'won'
            ? 'bg-green-200 border-green-600 text-green-800'
            : 'bg-red-200 border-red-600 text-red-800'
          }
        `}>
          {gameStatus === 'won'
            ? `You won in ${elapsedSeconds}s!`
            : 'Game over!'
          }
        </div>
      )}
    </div>
  );
}
