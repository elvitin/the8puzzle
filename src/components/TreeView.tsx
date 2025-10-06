import Tree, { type CustomNodeElementProps } from 'react-d3-tree';

interface TreeViewProps {
	data: any;
	renderNode: (props: CustomNodeElementProps) => JSX.Element;
}

export function TreeView({ data, renderNode }: TreeViewProps) {
	return (
		<div style={{ width: '100%', height: '100%' }}>
			<Tree
				data={data}
				orientation="vertical"
				pathFunc="step"
				renderCustomNodeElement={renderNode}
				separation={{ siblings: 1.2, nonSiblings: 1.2 }}
				nodeSize={{ x: 160, y: 140 }}
			/>
		</div>
	);
}
