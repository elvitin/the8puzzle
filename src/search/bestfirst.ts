import _ from 'lodash';
import { ThePuzzleBoard } from '../game/ThePuzzleBoard';
import type { SearchArgs, SearchNode, SearchResult } from '../types';

function popMinH(arr: SearchNode[]): SearchNode | undefined {
	if (arr.length === 0) return undefined;
	arr.sort((a, b) => a.h - b.h); // Best-first uses h(n)
	return arr.shift();
}

export function bestFirstSearch({ initial, goal, heuristic }: SearchArgs): SearchResult {
	const t0 = performance.now();

	const h0 = heuristic(initial);
	const root: SearchNode = { board: _.cloneDeep(initial), g: 0, h: h0, f: h0, children: [] };

	const open: SearchNode[] = [root];
	const visited = new Set<string>(); // To avoid cycles and redundant paths
	visited.add(ThePuzzleBoard.toString(initial));

	let nodesVisited = 0;

	while (open.length > 0) {
		const current = popMinH(open)!;
		nodesVisited++;

		if (ThePuzzleBoard.equalsTo(current.board, goal)) {
			const t1 = performance.now();
			let len = 0;
			let n: SearchNode | undefined = current;
			while (n?.parent) {
				len++;
				n = n.parent;
			}
			return { nodesVisited, pathLength: len, execTime: t1 - t0, root };
		}

		const neighbors = ThePuzzleBoard.generateNeighbors(current.board);
		for (const nb of neighbors) {
			const key = ThePuzzleBoard.toString(nb);

			if (visited.has(key)) continue;

			visited.add(key);
			const h = heuristic(nb);
			const child: SearchNode = {
				board: nb,
				g: current.g + 1,
				h,
				f: current.g + 1 + h, // f is not used for sorting, but good to have
				parent: current,
				children: [],
			};
			current.children.push(child);

			open.push(child);
		}
	}

	const t1 = performance.now();
	return { nodesVisited, pathLength: 0, execTime: t1 - t0, root };
}
