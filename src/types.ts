type Board = number[][];
type Heuristics = 'misplaced' | 'manhattan';
type SearchAlgorithms = 'astar' | 'bnb';

interface TreeNodeData {
	name: string;
	children?: TreeNodeData[];
}

type SearchNode = {
	board: number[][];
	g: number;
	h: number;
	f: number;
	children: SearchNode[];
};

export type { Board, Heuristics, SearchAlgorithms, TreeNodeData, SearchNode };
