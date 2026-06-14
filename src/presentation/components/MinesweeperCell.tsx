import type { Cell } from '../../domain/entities/Cell';
import { ADJACENT_MINE_COLOURS } from '../constants/difficultySettings';

interface CellProps {
  cell: Cell;
  onClick: () => void;
  onContextMenu: (event: React.MouseEvent) => void;
}

function getCellContent(cell: Cell): string {
  if (!cell.isRevealed) return cell.isFlagged ? 'F' : '';
  if (cell.isThereMine) return cell.isDeathMine ? '!!!' : 'X';
  if (cell.howManyAdjacentMines === 0) return '';
  return String(cell.howManyAdjacentMines);
}

function getCellClassName(cell: Cell): string {
  const base = 'w-8 h-8 flex items-center justify-center text-sm font-bold border select-none cursor-pointer';

  if (!cell.isRevealed) {
    return `${base} bg-gray-300 border-t-gray-100 border-l-gray-100 border-b-gray-500 border-r-gray-500 border-2 hover:bg-gray-250 active:bg-gray-400`;
  }

  if (cell.isThereMine) {
    const deathBg = cell.isDeathMine ? 'bg-red-500' : 'bg-gray-200';
    return `${base} ${deathBg} border border-gray-400 cursor-default`;
  }

  const numberColour = ADJACENT_MINE_COLOURS[cell.howManyAdjacentMines] ?? '';
  return `${base} bg-gray-200 border border-gray-400 cursor-default ${numberColour}`;
}

export default function MinesweeperCell({ cell, onClick, onContextMenu }: CellProps) {
  return (
    <button
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={getCellClassName(cell)}
    >
      {getCellContent(cell)}
    </button>
  );
}