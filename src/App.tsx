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
import type { CustomNodeElementProps } from 'react-d3-tree';

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
					<TreeView data={treeData} renderNode={CustomTreeNode} />
				) : (
					<div className="tree-placeholder">Clique em Start para gerar a árvore…</div>
				)}
			</div>
		</div>
	);
}

type NodeMetrics = Partial<Record<'g' | 'h' | 'f', number>>;

function parseTreeNode(node: TreeNodeData): { board?: Board; metrics?: NodeMetrics; label: string } {
	const label = typeof node.name === 'string' ? node.name : '';
	let board: Board | undefined;
	let metrics: NodeMetrics | undefined;

	const [boardPart, rawMetrics] = label.split('(');
	const boardNumbers = boardPart
		.trim()
		.split(/\s+/)
		.map(value => Number(value))
		.filter(value => !Number.isNaN(value));

	if (boardNumbers.length === 9) {
		board = [boardNumbers.slice(0, 3), boardNumbers.slice(3, 6), boardNumbers.slice(6, 9)];
	}

	if (rawMetrics) {
		rawMetrics
			.replace(')', '')
			.split(',')
			.map(chunk => chunk.trim())
			.forEach(chunk => {
				const [keyPart, valuePart] = chunk.split('=');
				const key = keyPart?.trim();
				const value = Number(valuePart);
				if (key && (key === 'g' || key === 'h' || key === 'f') && !Number.isNaN(value)) {
					if (!metrics) metrics = {};
					metrics[key] = value;
				}
			});
	}

	return { board, metrics, label };
}

function CustomTreeNode({ nodeDatum, toggleNode }: CustomNodeElementProps) {
	const { board, metrics, label } = parseTreeNode(nodeDatum as TreeNodeData);
	const metricPieces = (['g', 'h', 'f'] as const)
		.map(metricKey => {
			const value = metrics?.[metricKey];
			return value === undefined ? null : `${metricKey}=${value}`;
		})
		.filter((value): value is string => value !== null);

	return (
		<g>
			<foreignObject x="-70" y="-55" width="140" height="110">
				<div className="tree-node-card" onClick={toggleNode}>
					{board ? (
						<div className="tree-node-board">
							{board.map((row, rowIndex) => (
								<div className="tree-node-row" key={rowIndex}>
									{row.map((value, colIndex) => (
										<div key={colIndex} className={`tree-node-cell${value === 0 ? ' empty' : ''}`}>
											{value === 0 ? '' : value}
										</div>
									))}
								</div>
							))}
						</div>
					) : (
						<div className="tree-node-fallback">{label}</div>
					)}
					{metricPieces.length > 0 && <div className="tree-node-metrics">{metricPieces.join(' · ')}</div>}
				</div>
			</foreignObject>
		</g>
	);
}
