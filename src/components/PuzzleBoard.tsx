import { PuzzleTile } from './PuzzleTile';

type BoardProps = {
	board: number[][];
	onTileClick: (i: number, j: number) => void;
};

export function PuzzleBoard({ board, onTileClick }: BoardProps) {
	return (
		<div className="board">
			{board.map((row, i) =>
				row.map((value, j) => <PuzzleTile key={`${i}-${j}`} value={value} onClick={() => onTileClick(i, j)} />)
			)}
		</div>
	);
}
