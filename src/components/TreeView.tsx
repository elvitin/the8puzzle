import Tree from "react-d3-tree";

interface TreeViewProps {
	data: any;
}

export function TreeView({ data }: TreeViewProps) {
	return (
		<div id="treeWrapper" style={{ width: "100%", height: "500px" }}>
			<Tree data={data} orientation="vertical" />
		</div>
	);
}
