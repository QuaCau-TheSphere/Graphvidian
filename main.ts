/* Naming convention
bc prefix: Breadcrumbs
No prefix: Hierarchical Graph
alllowercase: iteration item of an array.forEach()
|                   | Breadcrumbs        | Hierarchical graph |
|-------------------|--------------------|--------------------|
| Relationship      | Link               | Edge               |
| Relationship type | Link field         | Edge type          |
| Node              | Source/target node | Start/end node     |
*/
import { Plugin } from 'obsidian';
var path = require("path");

var nodeData = {} 
var edgeData = {}

const bcNodeList = app.plugins.plugins.breadcrumbs.mainG.toJSON().nodes //The object structure in the Breadcrumbs node list is
const bcEdgeList = app.plugins.plugins.breadcrumbs.mainG.toJSON().edges //different to the object structure in the edge list
function debug() {
	console.log("nodeData", nodeData)
	console.log("edgeData", edgeData)
} 

export default class MyPlugin extends Plugin {
	async onload() {
		
console.clear()
/* Part 1: Initial data */

const nodeTypeListDeclaration = { //Styles used in final graph for each node type
	masterGraph: { 
		style: "shape=plaintext style=\"filled, rounded\" fontname=\"Lato\" margin=0.2 fillcolor=\"#c6cac3\"",
		graphHeader: 
		`splines=ortho;
		// overlap=false;
		style=rounded
		ranksep="0.4";
		label="Thay đổi niềm tin người có niềm tin tiêu cực";
		fontsize = 30
		labelloc="t";
		fontname="Lato";`,
	},
	Giaiphap: { 
		method: "End of edge type",
	},
	Ytuongtothon: {
		method: "End of edge type",  //End of edge type (end of Breadcrumbs field), index, tag, frontmatter, 
		style: "shape=box, penwidth=1.5 fillcolor=\"#D1E4DD\"", //green
	},
	Yeutohotro: {
		method: "End of edge type",
		style: "shape=note fillcolor=\"#D1D1E4\"", //purple
	},
	Thamkhao: {
		method: "End of edge type",
		style: "shape=plain fillcolor=white",
	},
	Hanhdong: {
		method: "End of edge type",
		style: "fillcolor=\"#E4D1D1\" shape=polygon"
	},
	branch_1a: {
		method: "Index",
		cluster: true,
		subgraphSetting: "label = \"1a Megan cảm thấy quả thực việc nói chuyện với Cueball sẽ đem lại điều mà mình luôn mong mỏi\"\ncolor=\"#D1E4DD\"\nstyle=\"filled, rounded\""
	},
	branch_1b: { 
		method: "Index",
		cluster: true,
		subgraphSetting: "label = \"1b Megan cảm thấy những người xung quanh cô cảm thấy cô nên trò chuyện với Cuball\"\ncolor=\"#D1DFE4\"\nstyle=\"filled, rounded\""
	},
	branch_i: {
		method: "Index",
		cluster: true,
		subgraphSetting: "label = \"i Megan dám nói rằng \\\"tôi sẽ không để nỗi sợ chi phối mình\\\"\"",
		separateGraph: true
	},
	branch_j: {
		method: "Index",
		cluster: true,
		subgraphSetting: "label = \"j Megan sẽ không dựa vào cảm xúc để biện minh cho hành động của mình\"",
	},
	branch_k: {
		method: "Index",
		cluster: true,
		subgraphSetting: "label = \"k Megan nghe được các câu chuyện của những người tương tự hoàn cảnh của mình\"",
	},
	branch_l: {
		method: "Index",
		cluster: true,
		subgraphSetting: "label = \"l Megan muốn đặt câu hỏi về tất cả những gì mình nghĩ\"",
	},
	branch_m: {
		method: "Index",
		cluster: true,
		subgraphSetting: "label = \"m Những Megan trong friendlist QC sẽ làm điều tương tự\"",
		
	},
	branch_n: {
		method: "Index",
		cluster: true,
		subgraphSetting: "label = \"n Tổ chức thành công cuộc đối thoại giữa những người khác biệt quan điểm\"",
	},
	branch_o: {
		method: "Index",
		cluster: true,
		subgraphSetting: "label = \"o Tổ chức thành công những buổi chia sẻ vòng tròn\"",
	},
	branch_p: {
		method: "Index",
		cluster: true,
		subgraphSetting: "label = \"p Tổ chức thành công các buổi nói chuyện của người có chuyên môn\"",
	},
	branch_q: {
		method: "Index",
		cluster: true,
		subgraphSetting: "label = \"q Các chủ doanh nghiệp đồng ý hỗ trợ nhân viên\"",
	},
	branch_r: {
		method: "Index",
		cluster: true,
		subgraphSetting: "label = \"r Cộng đồng bạn bè QC phát triển\"",
	},
	branch_s: {
		method: "Index",
		cluster: true,
		subgraphSetting: "label = \"s Kết hợp được với các dự án khác\"",
	},
} 
const edgeTypeListDeclaration = { //Styles used in final graph for each edge type
	masterGraph: {
		style: "penwidth=1" 
	},
	Giaiphap: {
		method: "Breadcrumbs",
	},
	Dichung: {
		method: "Breadcrumbs",
		pairing: true,
		style: "minlen=0 style=bold penwidth=5 dir=both arrowtype=odiamond" 
	},
	Ytuongtothon: {
		method: "Breadcrumbs",
	},
	Yeutohotro: {
		method: "Breadcrumbs",
	},
	Thamkhao: {
		method: "Breadcrumbs",
		style: "style=dashed " 
	},
	Hanhdong: {
		method: "Breadcrumbs",
	} 
}
const nodeTypeList = Object.keys(nodeTypeListDeclaration)
const edgeTypeList = Object.keys(edgeTypeListDeclaration)

var IsBreadcrumbsrunning = new Promise((resolve,reject) => {
	if(bcEdgeList.length !== 0){
		resolve('Breadcrumbs is running properly') 
	} else {
		reject('Breadcrumbs has problem') 
	} 
})
IsBreadcrumbsrunning.then(message => console.log(message))
.catch(message => console.log(message))


/* Part 2: Restructuring the Breadcrumbs database; creating better suited database for the goal */
/* Part 2.1: Bulding node object */
function makeLabel(name){ 
	return name.replace(/(?![^\n]{1,32}$)([^\n]{1,32})\s/g, '$1\\n').replace(/[❝❞]/g,'\\"')
} 
function IndividualNodeType(nodetype: string, i: number){
	this.settings = nodeTypeListDeclaration[nodetype]
	this.settings.order = i
	this.nodes = []
	this.neighborNode = {
		sourceOf: [] ,
		targetOf: []} 
}
function IndividualNode ( name: string, nodetype: string) {
	this.name = name
	this.label = makeLabel(this.name)
	this.index = this.name.split(" ")[0]
	this.path = this.name+".md"
	this.folder = this.path.split("/").slice(0, -1).join('/')
	this.tag = "none"
	this.frontmatter = "none"
	this.inMetadata = false
	this.endOfEdgeType = nodetype
	this.neighbor = { 
		sourceOf: bcEdgeList.filter(edge => edge.source==this.name).map(edge => edge.target),
		targetOf: bcEdgeList.filter(edge => edge.target==this.name).map(edge => edge.source)} 
	
	this.existsInMetadata = function() {
		if (Object.keys(app.metadataCache.fileCache).includes(this.path)){ 
			this.inMetadata = true
			var nodeMetadata = app.metadataCache.getCache(this.path)
			if (nodeMetadata.frontmatter !== undefined) {
				this.frontmatter = nodeMetadata.frontmatter
			} 
			if (nodeMetadata.tags !== undefined) {
				this.tag = nodeMetadata.tags
			} 
		}
	} 
}
function createNodeTmp(item, nodetype, nodeTypeTmp){
	const nodeTmp = new IndividualNode(item.target, nodetype) 
			
	nodeTmp.existsInMetadata() 
	nodeTypeTmp.nodes.push(nodeTmp) 	
} 
let i=0
nodeTypeList.forEach(nodetype => {
	const method = nodeTypeListDeclaration[nodetype].method
	const nodeTypeTmp = new IndividualNodeType(nodetype, i) 

	bcEdgeList.forEach(item => {
		if (method=="End of edge type") {
			if(item.attributes.field == nodetype) {
				createNodeTmp(item, nodetype, nodeTypeTmp) 
			}
		} 
		if (method=="Index") {
			var branchIndex = nodetype.split("_")[nodetype.split("_").length - 1] 
			var itemIndex = item.target.split(" ")[0]
			var itemBranchIndex = itemIndex.split("-")[0].split(".")[0]
			
			if (itemBranchIndex == branchIndex || itemBranchIndex+"+" == branchIndex) {
				createNodeTmp(item, nodetype, nodeTypeTmp)
			} 
		}
	})
	nodeData[nodetype] = nodeTypeTmp
	i++
})
nodeTypeList.forEach(nodetype => {
	var tmpTarget = [] 
	var tmpSource = [] 
	nodeData[nodetype].nodes.forEach(node=> {
		tmpTarget = tmpTarget.concat(node.neighbor.targetOf)
		tmpSource = tmpSource.concat(node.neighbor.sourceOf)
	})
	nodeData[nodetype].neighborNode.targetOf = [...new Set(tmpTarget)]
	nodeData[nodetype].neighborNode.sourceOf = [...new Set(tmpSource)]
})

/* Part 2.2: Bulding edge object */
function IndividualEdgeType(){
	this.settings = "" 
	this.edges = []
}
function IndividualEdge (start: string, dir: string, end: string, id: string) {
	this.start = start
	this.end = end
	this.id = id
}
const edgeTypeNoDeclare = new IndividualEdgeType() 
edgeTypeNoDeclare.type = "This link field in Breadcrumbs plugin isn't declared in Hierarchical Graph plugin" 
let j=0

edgeTypeList.forEach(edgetype => {
	const edgeTypeTmp = new IndividualEdgeType() 
	edgeTypeTmp.settings = edgeTypeListDeclaration[edgetype]
	edgeTypeTmp.settings.order = j

	bcEdgeList.forEach(edge => {
		var bcEdgeField = edge.attributes.field
		const edgeTmp = new IndividualEdge() 
		edgeTmp.start = edge.source
		edgeTmp.end = edge.target
		edgeTmp.id = edge.key
		if (bcEdgeField == edgetype) { 
			edgeTypeTmp.edges.push(edgeTmp) 
		} 
		else if (!edgeTypeList.includes(bcEdgeField)) { 
			edgeTypeNoDeclare.edges.push(edgeTmp)
		}
	}); //Run through all edges in BC edge list (bcEdgeList) 
	edgeData[edgetype] = edgeTypeTmp
	j++
}) //Run through all edge types in HG edge type declaration (edgeTypeList)
edgeData["No Declared"] = edgeTypeNoDeclare

/* Part 3: Making dot file */

function addNodesForEachGraph(graph,nodetype,node): void {
	const neighborNode = nodeData[graph].neighborNode
	
	if (graph == "masterGraph") {
		graphDot.masterGraph += `"${node.name}" [ label = "${node.label}" ] \n`
	} 
	if (graph !== "masterGraph" && nodetype == graph) {
		graphDot[graph] += `"${node.name}" [ label = "${node.label}" ] \n`
	} 
	if (graph !== "masterGraph" && nodetype !== graph && (neighborNode.sourceOf.includes(node.name) || neighborNode.targetOf.includes(node.name))) {
		graphDot[graph] += `"${node.name}" [ label = "${node.label}" ] \n`
	} 
}

function addPairingEdgesForEachGraph(graph,edgetype,edge,k,style) {
	if (graph == "masterGraph") {
		graphDot.masterGraph += `
subgraph cluster_${edgetype}_${k}{
rank=same
edge [ ${style} ]
"${edge.start}" -> "${edge.end}"\n}`
	} 
	if (graph != "masterGraph" && edgetype == graph) {
		graphDot[graph] += `
		subgraph cluster_${edgetype}_${k}{
			rank=same
			edge [ ${style} ]
			"${edge.start}" -> "${edge.end}"\n}`
		}
		k++
	}
function addNonPairingEdgesForEachGraph(graph,edgetype,edge) {
	if (graph == "masterGraph") {
		graphDot.masterGraph += `"${edge.start}" -> "${edge.end}"\n`
	}
	function checkIfNode(edgetype, edge, graph) {
		var a = nodeData[graph].nodes.filter(node => node.name==edge.start || node.name==edge.end)
		if (a.length !=0 ) {
			console.log(graph,edgetype, edge, a)
			return true
		} 
	}
	
	if (graph !== "masterGraph" && checkIfNode(edgetype, edge, graph)) {
		graphDot[graph] += `"${edge.start}" -> "${edge.end}"\n`
	}
}

const graphDot = {}    
for (const graph in nodeTypeListDeclaration) {
	/* 3.1: Print all nodes by type */
	graphDot[graph] = `digraph ${graph}{\n${nodeData.masterGraph.settings.graphHeader}\n//NODES\n//====================\n\n` ;
	nodeTypeList.forEach(nodetype => {
		const style = nodeData[nodetype].settings.style
		const cluster = nodeData[nodetype].settings.cluster
		const subgraphSetting = nodeData[nodetype].settings.subgraphSetting
		
		graphDot[graph] +=	 `\nnode [ ${nodeData.masterGraph.settings.style} ] //Reset style\n\n` 
		graphDot[graph] += `//All ${nodetype} nodes\n` ;
		if(cluster == true) {
			graphDot[graph] += `subgraph cluster_${nodetype}{\n${subgraphSetting}\n`
		} 
		if (style !== undefined) {
			graphDot[graph] += `\nnode [ ${style} ]\n`
		} 
		
		nodeData[nodetype].nodes.forEach(node => addNodesForEachGraph(graph,nodetype,node))
		
		if(cluster == true) {
			graphDot[graph] += `}\n`
		} 
	})
	
	
	/* 3.2: Print all edges by type */
	graphDot[graph] += `\n\n//EDGES\n//====================\n` ;
	var k=0
	
	edgeTypeList.forEach(edgetype => {
		const sameRank = edgeData[edgetype].settings.sameRank
		const cluster = edgeData[edgetype].settings.cluster
		const style = edgeData[edgetype].settings.style
		const pairing = edgeData[edgetype].settings.pairing
		
		if (edgeData.masterGraph.settings.style !== undefined) {
			graphDot[graph] += `\nedge [ ${edgeData.masterGraph.settings.style} ] //Reset style\n`
		} 
		graphDot[graph] += `\n//All ${edgetype} edges\n`
		
		if (pairing == true) {
			edgeData[edgetype].edges.forEach (edge => { 
				addPairingEdgesForEachGraph(graph,edgetype,edge,k,style) 
				k++
			});
		} else { 
			if (cluster == true && sameRank == true) {
				graphDot[graph] += `subgraph cluster_${edgetype}{\nrank=same\n`
			}
			if (cluster == true && sameRank !== true) {
				graphDot[graph] += `subgraph cluster_${edgetype}{\n`
			} 
			if (cluster !== true && sameRank == true) {
				graphDot[graph] += `subgraph {\nrank=same\n`
			}
			if (style !== undefined) {
				graphDot[graph] += `\nedge [ ${style} ]\n`
			} 
			edgeData[edgetype].edges.forEach (edge => { 
				addNonPairingEdgesForEachGraph(graph,edgetype,edge)	
			})
			
			if (cluster == true || sameRank == true) {
				graphDot[graph] += `}\n`
			} 
		} 
	})
	graphDot[graph] += `\n}`
}

/* Part 4: Export to file */

for (const graph in nodeTypeListDeclaration) {
	var configPath = this.app.vault.configDir + "/plugins/dotmaker/graphs/" + graph + ".dot";
	app.vault.adapter.write(configPath,graphDot[graph])
	console.log(graphDot[graph] )
} 
console.log('done')
debug()
console.log(". = %s", path.resolve("."));
console.log("__dirname = %s", path.resolve(__dirname));
	
};
onunload() {
	console.log('unloading plugin')
}
}