import type { Board } from '../types';

// heuristics.ts
export function misplacedTiles(board: Board, goal: Board): number {
	let count = 0;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (board[i][j] !== 0 && board[i][j] !== goal[i][j]) {
				count++;
			}
		}
	}
	return count;
}

export function manhattanDistance(board: Board, goal: Board): number {
	let distance = 0;
	const goalPos = new Map<number, [number, number]>();
	// Mapa do valor -> coordenadas no estado final
	for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) goalPos.set(goal[i][j], [i, j]);

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			const val = board[i][j];
			if (val !== 0) {
				const [gi, gj] = goalPos.get(val)!;
				distance += Math.abs(i - gi) + Math.abs(j - gj);
			}
		}
	}
	return distance;
}
