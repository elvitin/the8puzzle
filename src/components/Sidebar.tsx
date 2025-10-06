import type { Heuristics, SearchAlgorithms } from '../types';

interface SidebarProps {
	onShuffle: () => void;
	onStart: () => void;
	heuristic: string;
	setHeuristic: (h: Heuristics) => void;
	algorithm: string;
	setAlgorithm: (a: SearchAlgorithms) => void;
	nodesVisited: number;
	execTime: number;
	pathLength: number;
}

export function Sidebar({
	onShuffle,
	onStart,
	heuristic,
	setHeuristic,
	algorithm,
	setAlgorithm,
	nodesVisited,
	execTime,
	pathLength,
}: SidebarProps) {
	return (
		<div className="sidebar">
			<button type="button" onClick={onShuffle}>
				Shuffle
			</button>
			<div>
				<label>Avaliação:</label>
				<select value={heuristic} onChange={e => setHeuristic(e.target.value as Heuristics)}>
					<option value="misplaced">Peças fora do lugar</option>
					<option value="manhattan">Distância de Manhattan</option>
				</select>
			</div>
			<div>
				<label>Algoritmo:</label>
				<select value={algorithm} onChange={e => setAlgorithm(e.target.value as SearchAlgorithms)}>
					<option value="astar">A*</option>
					<option value="bestfirst">Best-First</option>
				</select>
			</div>
			<button type="button" onClick={onStart}>
				Start
			</button>
			<div className="metrics">
				<div className="card visited">
					<span className="label">Nós visitados</span>
					<div className="value">{nodesVisited}</div>
				</div>
				<div className="card time">
					<span className="label">Tempo (ms)</span>
					<div className="value">{execTime.toFixed(2)}</div>
				</div>
				<div className="card path">
					<span className="label">Caminho</span>
					<div className="value">{pathLength}</div>
				</div>
			</div>
		</div>
	);
}
