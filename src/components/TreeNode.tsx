import type { CustomNodeElementProps } from 'react-d3-tree';
import type { Board, TreeNodeData } from '../types';

type NodeMetrics = Partial<Record<'g' | 'h' | 'f', number>>;

function parseTreeNode(node: TreeNodeData): { board?: Board; metrics?: NodeMetrics; label: string; isPath?: boolean } {
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

	// Check attributes for metrics if not found in label
	const attributes = (node as any).attributes;
	if (attributes && !metrics) {
		const collected: NodeMetrics = {};
		(['g', 'h', 'f'] as const).forEach(metric => {
			const rawValue = attributes[metric];
			if (typeof rawValue === 'number') {
				collected[metric] = rawValue;
			} else if (typeof rawValue === 'string') {
				const numeric = Number(rawValue);
				if (!Number.isNaN(numeric)) {
					collected[metric] = numeric;
				}
			}
		});
		if (Object.keys(collected).length) {
			metrics = collected;
		}
	}

	const isPath = attributes?.isPath === true || (node as any).isPath === true;

	return { board, metrics, label, isPath };
}

function TreeNode({ nodeDatum, toggleNode }: CustomNodeElementProps) {
	const { board, metrics, label, isPath } = parseTreeNode(nodeDatum as TreeNodeData);

	return (
		<g>
			<foreignObject x="-70" y="-65" width="140" height="130">
				<div className={`tree-node-card${isPath ? ' is-path' : ''}`} onClick={toggleNode}>
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
					{metrics && (
						<div className="tree-node-metrics">
							{(['g', 'h', 'f'] as const).map(metricKey => {
								const value = metrics[metricKey];
								return value !== undefined ? (
									<span key={metricKey} className="metric-badge">
										{metricKey}={value}
									</span>
								) : null;
							})}
						</div>
					)}
				</div>
			</foreignObject>
		</g>
	);
}

export { TreeNode };
