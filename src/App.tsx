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
import { findZero, possibleMoves, toD3Tree } from './helpers';

function hValue(key: Heuristics, board: Board, goal: Board): number {
	return key === 'misplaced' ? misplacedTiles(board, goal) : manhattanDistance(board, goal);
}

export function App() {
	const [initialState, setInitialState] = React.useState<Board>([
		[1, 2, 3],
		[4, 5, 6],
		[7, 8, 0],
	]);
	const [goalState, setGoalState] = React.useState<Board>([
		[1, 2, 3],
		[4, 5, 6],
		[7, 8, 0],
	]);
	const [heuristic, setHeuristic] = React.useState<Heuristics>('misplaced');
	const [algorithm, setAlgorithm] = React.useState<SearchAlgorithms>('astar');
	const [nodesVisited, setNodesVisited] = React.useState<number>(0);
	const [execTime, setExecTime] = React.useState<number>(0);
	const [pathLength, setPathLength] = React.useState<number>(0);
	const [treeData, setTreeData] = React.useState<TreeNodeData | undefined>();
	const d3DataMemo = React.useMemo(() => (treeData ? treeData : undefined), [treeData]);

	// Trecho dentro de App.tsx para mover peças
	function handleTileClick(i: number, j: number) {
		const newState = goalState.map(row => row.slice());
		// encontra coordenadas do zero
		const [zi, zj] = findZero(newState);
		// verifica se (i,j) é adjacente a (zi,zj)
		if (Math.abs(i - zi) + Math.abs(j - zj) === 1) {
			// troca os valores
			[newState[zi][zj], newState[i][j]] = [newState[i][j], newState[zi][zj]];
			setGoalState(newState);
		}
	}

	function shufflePuzzle() {
		const board = goalState.map(r => r.slice());
		for (let k = 0; k < 30; k++) {
			// gera um dos movimentos possíveis aleatoriamente
			const [zi, zj] = findZero(board);
			const moves = possibleMoves(zi, zj);
			const [ni, nj] = moves[Math.floor(Math.random() * moves.length)];
			[board[zi][zj], board[ni][nj]] = [board[ni][nj], board[zi][zj]];
		}
		setInitialState(board);
	}

	function handleStart() {
		if (!initialState || !goalState) return;
		// Medir tempo
		const start = performance.now();
		const result = aStarSearch({
			initial: initialState,
			goal: goalState,
			heuristic: b => hValue(heuristic, b, goalState),
		});
		const end = performance.now();
		setNodesVisited(result.nodesVisited);
		setPathLength(result.pathLength);
		setExecTime(result.execTime ?? end - start);

		// Exemplo: gerar data para TreeView (pode criar a partir de result.path ou similar)
		setTreeData(toD3Tree(result.root));
	}

	return (
		<React.Fragment>
			{/* <div>
				<a href="https://vite.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div> */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '280px 1fr',
					gap: 16,
					height: '100vh',
				}}
			>
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
				<div style={{ display: 'grid', padding: 16, gridTemplateRows: 'auto 1fr', gap: 16 }}>
					<div>
						<h3>Estado final (clique em peças vizinhas ao vazio para definir)</h3>
						<PuzzleBoard board={goalState} onTileClick={handleTileClick} />
						<h3 style={{ marginTop: 12 }}>Estado Inicial</h3>
						<PuzzleBoard
							board={initialState}
							onTileClick={() => {
								/* apenas exibição, será randomizado pelo shuffle */
							}}
						/>
						<div>
							<h3>Árvore de Busca</h3>
							{d3DataMemo ? (
								<TreeView data={d3DataMemo} />
							) : (
								<div style={{ opacity: 0.7 }}>Clique em Start para gerar a árvore…</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}
