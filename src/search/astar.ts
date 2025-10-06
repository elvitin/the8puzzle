// astar.ts (pseudo-código)
import _ from 'lodash';
import type { Board } from '../types';
import { ThePuzzleBoard } from '../game/ThePuzzleBoard';

// src/search/astar.ts
export type AStarNode = {
	board: Board; // estado 3x3 (0 = vazio)
	g: number; // custo acumulado desde o inicial
	h: number; // heurística para este estado
	f: number; // f = g + h
	parent?: AStarNode; // ponteiro para reconstruir o caminho
	children: AStarNode[]; // filhos gerados (para desenhar a árvore)
};

function popMinF(arr: AStarNode[]): AStarNode | undefined {
	if (arr.length === 0) return undefined;
	arr.sort((a, b) => a.f - b.f);
	return arr.shift();
}

export type AStarArgs = {
	initial: Board;
	goal: Board;
	heuristic: (b: Board) => number; // h(n)
};

export type AStarResult = {
	nodesVisited: number;
	pathLength: number;
	execTime: number;
	root?: AStarNode;
};

export function aStarSearch({ initial, goal, heuristic }: AStarArgs): AStarResult {
	const t0 = performance.now();

	// Nó raiz
	const h0 = heuristic(initial);
	const root: AStarNode = { board: _.cloneDeep(initial), g: 0, h: h0, f: h0, children: [] };

	const open: AStarNode[] = [root];
	const gBest = new Map<string, number>(); // melhor g conhecido por estado
	gBest.set(ThePuzzleBoard.toString(initial), 0);

	let nodesVisited = 0;

	while (open.length > 0) {
		const current = popMinF(open)!;
		nodesVisited++;

		// Objetivo atingido
		if (ThePuzzleBoard.equalsTo(current.board, goal)) {
			const t1 = performance.now();
			// calcula tamanho do caminho
			let len = 0;
			let n: AStarNode | undefined = current;
			while (n?.parent) {
				len++;
				n = n.parent;
			}
			return { nodesVisited, pathLength: len, execTime: t1 - t0, root };
		}

		// Expande vizinhos
		const neighbors = ThePuzzleBoard.generateNeighbors(current.board);
		for (const nb of neighbors) {
			const key = ThePuzzleBoard.toString(nb);
			const tentativeG = current.g + 1;

			// Se já temos um g melhor ou igual para este estado, pula
			if (gBest.has(key) && tentativeG >= (gBest.get(key) as number)) continue;

			const h = heuristic(nb);
			const child: AStarNode = {
				board: nb,
				g: tentativeG,
				h,
				f: tentativeG + h,
				parent: current,
				children: [],
			};
			current.children.push(child); // liga na árvore para visualização

			gBest.set(key, tentativeG);
			open.push(child);
		}
	}

	const t1 = performance.now();
	return { nodesVisited, pathLength: 0, execTime: t1 - t0, root };
}
