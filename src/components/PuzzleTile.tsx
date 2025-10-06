interface TileProps {
	value: number;
	onClick: () => void;
}

export function PuzzleTile({ value, onClick }: TileProps) {
	const isEmpty = value === 0;
	return (
		<button type="button" className={`tile ${isEmpty ? 'empty' : ''}`} onClick={onClick}>
			{isEmpty ? '' : value}
		</button>
	);
}
