import _ from 'lodash';
import type { SearchArgs, SearchNode, SearchResult } from '../types';
import { ThePuzzleBoard } from '../game/ThePuzzleBoard';

function popMinF(arr: SearchNode[]): SearchNode | undefined {
	if (arr.length === 0) return undefined;
	arr.sort((a, b) => a.f - b.f); // A* usa f(n) = g(n) + h(n)
	return arr.shift();
}

export function aStarSearch({ initial, goal, heuristic }: SearchArgs): SearchResult {
	const t0 = performance.now();

	// Nó raiz
	const h0 = heuristic(initial);
	const root: SearchNode = { board: _.cloneDeep(initial), g: 0, h: h0, f: h0, children: [] };

	const open: SearchNode[] = [root];
	const gBest = new Map<string, number>(); // melhor g conhecido por estado
	gBest.set(ThePuzzleBoard.toString(initial), 0);

	let nodesVisited = 0;

	while (open.length > 0) {
		const current = popMinF(open)!;
		nodesVisited++;

		// Objetivo atingido
		if (ThePuzzleBoard.equalsTo(current.board, goal)) {
			const t1 = performance.now();
			const path: SearchNode[] = [];
			let n: SearchNode | undefined = current;
			while (n) {
				n.isPath = true;
				path.unshift(n);
				n = n.parent;
			}
			return { nodesVisited, pathLength: path.length - 1, execTime: t1 - t0, root, solutionPath: path };
		}

		// Expande vizinhos
		const neighbors = ThePuzzleBoard.generateNeighbors(current.board);
		for (const nb of neighbors) {
			const key = ThePuzzleBoard.toString(nb);
			const tentativeG = current.g + 1;

			// Se já temos um g melhor ou igual para este estado, pula
			if (gBest.has(key) && tentativeG >= (gBest.get(key) as number)) continue;

			const h = heuristic(nb);
			const child: SearchNode = {
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
	return { nodesVisited, pathLength: 0, execTime: t1 - t0, root, solutionPath: [] };
}
