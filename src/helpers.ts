import type { Board, SearchNode, TreeNodeData } from './types';

function boardToLabel(b: Board, g: number, h: number, f: number): string {
	const flat = b.flat();
	// 3 linhas de 3 números (0 vazio), e custos g/h/f na última linha
	return `${flat.slice(0, 3).join(' ')}\n
          ${flat.slice(3, 6).join(' ')}\n
          ${flat.slice(6, 9).join(' ')}\n
          (g=${g}, h=${h}, f=${f})\n`;
}

function toD3Tree(root: SearchNode | undefined, solutionPath: SearchNode[] = []): TreeNodeData | undefined {
	if (!root) return undefined;

	const solutionNodeSet = new Set(solutionPath);

	const recur = (n: SearchNode): TreeNodeData => {
		const isPath = solutionNodeSet.has(n);
		return {
			name: boardToLabel(n.board, n.g, n.h, n.f),
			attributes: {
				g: n.g,
				h: n.h,
				f: n.f,
				isPath,
			},
			children: n.children?.length ? n.children.map(recur) : undefined,
		};
	};

	return recur(root);
}

export { toD3Tree };
