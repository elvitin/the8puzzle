type Board = number[][];
type Heuristics = 'misplaced' | 'manhattan';
type SearchAlgorithms = 'astar' | 'bestfirst';

interface TreeNodeData {
	name: string;
	children?: TreeNodeData[];
}

interface SearchNode {
	board: Board; // estado 3x3 (0 = vazio)
	g: number; // custo acumulado desde o inicial
	h: number; // heurística para este estado
	f: number; // f = g + h
	parent?: SearchNode; // ponteiro para reconstruir o caminho
	children: SearchNode[]; // filhos gerados (para desenhar a árvore)
}

interface SearchArgs {
	initial: Board;
	goal: Board;
	heuristic: (b: Board) => number;
}

interface SearchResult {
	nodesVisited: number;
	pathLength: number;
	execTime: number;
	root?: SearchNode;
}

export type { Board, Heuristics, SearchAlgorithms, TreeNodeData, SearchNode, SearchArgs, SearchResult };
