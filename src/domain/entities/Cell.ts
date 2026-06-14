export interface Cell {
  isThereMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  howManyAdjacentMines: number;
  isDeathMine?: boolean;
}

export type Grid = Cell[][];