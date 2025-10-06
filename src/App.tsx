import React from 'react';
//import reactLogo from "./assets/react.svg";
//import viteLogo from "/vite.svg";
import './App.css';
import { aStarSearch } from './search/astar';
import { Sidebar } from './components/Sidebar';
import type { TreeNodeData, Board, Heuristics, SearchAlgorithms } from './types';
import { PuzzleBoard } from './components/PuzzleBoard';
import { TreeView } from './components/TreeView';
import { manhattanDistance, misplacedTiles } from './search/heuristics';
import { toD3Tree } from './helpers';
import { ThePuzzleBoard } from './game/ThePuzzleBoard';
import { TreeNode } from './components/TreeNode';
import { bestFirstSearch } from './search/bestfirst';

function hValue(key: Heuristics, board: Board, goal: Board): number {
	return key === 'misplaced' ? misplacedTiles(board, goal) : manhattanDistance(board, goal);
}

export function App() {
	const [goalBoardState] = React.useState<ThePuzzleBoard>(new ThePuzzleBoard());

	const [initialState, setInitialState] = React.useState<Board>(ThePuzzleBoard.createBoard());
	const [goalState, setGoalState] = React.useState<Board>(ThePuzzleBoard.createBoard());
	const [heuristic, setHeuristic] = React.useState<Heuristics>('misplaced');
	const [algorithm, setAlgorithm] = React.useState<SearchAlgorithms>('astar');
	const [nodesVisited, setNodesVisited] = React.useState<number>(0);
	const [execTime, setExecTime] = React.useState<number>(0);
	const [pathLength, setPathLength] = React.useState<number>(0);
	const [treeData, setTreeData] = React.useState<TreeNodeData | undefined>();

	// Trecho dentro de App.tsx para mover peças
	function handleTileClick(i: number, j: number) {
		setGoalState(goalBoardState.move(i, j));
	}

	function shufflePuzzle() {
		setInitialState(goalBoardState.shuffle());
	}

	function handleStart() {
		if (!initialState || !goalState) return;

		const searchArgs = {
			initial: initialState,
			goal: goalState,
			heuristic: (b: Board) => hValue(heuristic, b, goalState),
		};

		const result = algorithm === 'astar' ? aStarSearch(searchArgs) : bestFirstSearch(searchArgs);

		setNodesVisited(result.nodesVisited);
		setPathLength(result.pathLength);
		setExecTime(result.execTime);
		setTreeData(toD3Tree(result.root));
	}

	return (
		<div className="app-shell">
			<div className="left-column">
				<Sidebar
					onShuffle={shufflePuzzle}
					onStart={handleStart}
					heuristic={heuristic}
					setHeuristic={setHeuristic}
					algorithm={algorithm}
					setAlgorithm={setAlgorithm}
					nodesVisited={nodesVisited}
					execTime={execTime}
					pathLength={pathLength}
				/>
				<div className="board-group">
					<h3>Estado final (clique para editar)</h3>
					<PuzzleBoard board={goalState} onTileClick={handleTileClick} />
					<h3 style={{ marginTop: 12 }}>Estado Inicial</h3>
					<PuzzleBoard
						board={initialState}
						onTileClick={() => {
							/* apenas exibição */
						}}
					/>
				</div>
			</div>
			<div className="right-column">
				<h3>Árvore de Busca</h3>
				{treeData ? (
					<TreeView data={treeData} renderNode={TreeNode} />
				) : (
					<div className="tree-placeholder">Clique em Start para gerar a árvore…</div>
				)}
			</div>
		</div>
	);
}
