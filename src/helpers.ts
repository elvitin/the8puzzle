import type { Board, SearchNode, TreeNodeData } from './types';

function inBounds(i: number, j: number): boolean {
	return i >= 0 && i < 3 && j >= 0 && j < 3;
}

function cloneBoard(board: Board) {
	return board.map(row => row.slice());
}

function serialize(b: Board): string {
	return b.flat().join(',');
}

function findZero(b: Board): [number, number] {
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (b[i][j] === 0) return [i, j];
		}
	}
	return [2, 2];
}

function generateNeighbors(b: Board): Board[] {
	const [zi, zj] = findZero(b);
	const moves = possibleMoves(zi, zj);
	const result: Board[] = [];
	for (const [ni, nj] of moves) {
		const nb = cloneBoard(b);
		// swap zero with (ni, nj)
		[nb[zi][zj], nb[ni][nj]] = [nb[ni][nj], nb[zi][zj]];
		result.push(nb);
	}
	return result;
}

function possibleMoves(zi: number, zj: number): [number, number][] {
	const dirs: [number, number][] = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	];
	const res: [number, number][] = [];
	for (const [di, dj] of dirs) {
		const ni = zi + di;
		const nj = zj + dj;
		if (inBounds(ni, nj)) res.push([ni, nj]);
	}
	return res;
}

function boardToLabel(b: number[][], g: number, h: number, f: number): string {
	const flat = b.flat();
	// 3 linhas de 3 números (0 vazio), e custos g/h/f na última linha
	return `${flat.slice(0, 3).join(' ')}\n
          ${flat.slice(3, 6).join(' ')}\n
          ${flat.slice(6, 9).join(' ')}\n
          (g=${g}, h=${h}, f=${f})\n`;
}

function toD3Tree(root: SearchNode | undefined): TreeNodeData | undefined {
	if (!root) return undefined;

	const recur = (n: SearchNode): TreeNodeData => ({
		name: boardToLabel(n.board, n.g, n.h, n.f),
		children: n.children?.length ? n.children.map(recur) : undefined,
	});

	return recur(root);
}

export { cloneBoard, serialize, generateNeighbors, findZero, possibleMoves, toD3Tree };
