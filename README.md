**What it is:** an Obsidian plugin to generate hierarchial graphs, with the nodes are from your Obsidian vault
**How it does:** convert the database from Breacrumbs to .dot format which Graphviz can understand
**Why it is made:** to combine the power of Obsidian and Graphviz, which isn't addressed by other plugins at the time of it is made

For a detailed review of why other similar plugins don't cover my needs, as well as the roadmap for the future, read [this post on the Obsidian forum](https://forum.obsidian.md/t/graphviz-and-hierarchical-graph-layout-a-review-and-plugin-proposal/31596?u=ooker). 

# Demo
Master graph:
![](https://i.imgur.com/y4D5vGU.png)

A cluster of the master graph:
![](https://i.imgur.com/JYC1OBj.png)

# Features
- Auto-wrap node lables to prevent overflow texts
- Detect different node type whether by it being the end node of a particular edge type, or by the index at the beginning of its title
- Support default node and edge styles 
- Support subgraphs, and styling for each subgraph
- Support same rank for each subgraph
- Support cluster for each subgraph
- Support pairing nodes (nodes that should be a cluster by themselves)
- Generate a master graph and individual graphs of each cluster (ideal for large graph) 
- Generate with `unflatten` (useful to [distribute nodes on the same rank of a wide graph to different lines](https://stackoverflow.com/a/11136488/3416774))

# How to use
Since I make for myself to serve my need, it doesn't have a nice UI yet. To use it to serve your need, you will need to get your hand wet 😎

Things you wil need:
- Install and be familiar with [Obsidian](https://obsidian.md/ "Obsidian"), [Breadcrumbs](https://github.com/SkepticMystic/breadcrumbs), and [Graphviz](https://graphviz.org/ "Graphviz")
- Know how to manually install a plugin by following [the first 5 minutes of this video](https://www.youtube.com/watch?v=9lA-jaMNS0k9)
- (Optional) Try to use VSCode to work on main.ts file, use `npm run dev` to watch for change in the main.ts file and automatically update the main.js file, and [Hot-Reload](https://github.com/pjeby/hot-reload "pjeby/hot-reload: Automatically reload Obsidian plugins in development when their files are changed") to automatically reload the plugin when the main.js file is changed. (You can directly change the main.js file though, as how I used to do when I was like you: inexperienced and be intimidated with what I just say to you 🤡)

If you also want to have a quick start to learn JavaScript, you can start with this 5 minute video: [JavaScript objects explained the visual way](https://www.youtube.com/watch?v=BRSg22VacUA "JavaScript objects explained the visual way - YouTube")

## The anatomy of the script
The two most important objects you need to change is the `nodeTypeListDeclaration` and `edgeTypeListDeclaration`. Both contain the `masterGraph`, which contain the default styles and graph declaration. You should not change its _key_, but you can change its value.


### `edgeTypeListDeclaration`
The object looks like this:

```js
const edgeTypeListDeclaration = { //Styles used in final graph for each edge type
	masterGraph: {
        style: "penwidth=1" 
	},
	edgeType1: {
        },
    edgeType2: {
    },
	pairingEdgeType: {
		pairing: true,
		style: "minlen=0 style=bold penwidth=5 dir=both arrowtype=odiamond" 
	},
	edgeType3: {
	},
}
```
It consists these keys: `masterGraph`, `edgeType1`, `edgeType2`, `edgeType3`, `pairingEdgeType`. Except the `masterGraph`, they are the [relationship type](https://breadcrumbs-wiki.onrender.com/docs/Getting%20Started/Hierarchies "Hierarchies | Breadcrumbs") that you have used in Breadcrumbs. Replace them with the names you use.
![](https://i.imgur.com/hL3zsSG.png)

The values of these keys (indicating by the curly brackets after the colons at the ends of the keys) are themselves objects. These objects may or may not have these keys: `style`, `pairing`. The value of the `style` is what you would put into `edge [ ]` in Graphviz. If the value of `pairing` is false or the key is missing, then the edges are printed normally. If the value is true, then in the output each edge of that type will be in a separate cluster with `rank=same`, like this:

```js
subgraph cluster_pairingEdgeType_0{
rank=same
edge [ minlen=0 style=bold penwidth=5 dir=both arrowtype=odiamond ]
"a1" -> "a1"
}
subgraph cluster_pairingEdgeType_1{
rank=same
edge [ minlen=0 style=bold penwidth=5 dir=both arrowtype=odiamond ]
"a2" -> "a3"
}
subgraph cluster_pairingEdgeType_2{
    rank=same
edge [ minlen=0 style=bold penwidth=5 dir=both arrowtype=odiamond ]
"b1" -> "b2"
}
```
This is convenient if you are building an [issue tree](https://en.wikipedia.org/wiki/Issue_tree "Issue tree - Wikipedia"), and you need to emphasize that two or more solutions need to go together to solve the problem. (E.g.: "Solution a1, a2, and a3 need to be addressed at the same time to solve problem A"). 

### `nodeTypeListDeclaration` 
The object looks like this:
```js
const nodeTypeListDeclaration = { //Styles used in final graph for each node type
	masterGraph: { 
		style: "shape=plaintext style=\"filled, rounded\" fontname=\"Lato\" margin=0.2 fillcolor=\"#c6cac3\"",
		graphHeader: 
		`splines=ortho;
		style=rounded
		label="Graph name";
		fontsize = 30
		fontname="Lato";`,
	},
	edgeType1: { 
		method: "End of edge type",
	},
	branch_1a: {
		method: "Index",
		style: "shape=box, penwidth=1.5 fillcolor=\"#D1E4DD\"",
        sameRank: true
	},
	branch_1b: {
		method: "Index",
		cluster: true,
		subgraphSetting: "label = \"foobar\"\ncolor=\"#D1E4DD\"\nstyle=\"filled, rounded\""
	},
```
While the edge types are totally depended on the types you declared in Breadcrumbs, you can have more options with nodes. Two current available methods are: `End of edge type`, and `Index`. If it's `End of edge type`, then the name of the node type should be exactly the same with the name of the edge type. (In the example it's `edgeType1`). If it's `Index`, then these two conditions must be met:
- The name of the type should have the index at the end, after an underscore. E.g. `blabla_1b`, `bloblo_i`
- The index of the node should be at the beginning of its title, separate with the name by a space, and splited by dots. E.g. `1b.1 Hello internet`, `i.j.k I dream a dream`

If `sameRank` or `cluster` has value true, then the nodes of that type will be contained in a subgraph.

If a node has multiple types, then Graphviz will decide the output based on the order of the types.

### Other configs
To change the output folder to a different location (default is in _.obsidian/plguins/dotmaker/graphs_), change the value of `workingDirectory`:
![](https://i.imgur.com/MyrWl9n.png)

To change how indexes are detected, change these lines:
![](https://i.imgur.com/wmU5euJ.png)

To change the Graphviz command (default is `unflatten -l 3 graphname.dot | dot -Tpng -o graphname.png`), change the value of `command`:
![](https://i.imgur.com/9TXyi73.png)

To investigate how Breadcrumbs organize the data, visit the console log and type in `app.plugins.plugins.breadcrumbs.mainG.toJSON()`.

# About me
[lyminhnhat.com](https://lyminhnhat.com?utm_source=GitHub+%C2%BB+Obsidian+Hierarchical+Graph+%C2%BB+Readme&utm_medium=Homepage&utm_campaign=Giai+%C4%91o%E1%BA%A1n+1) (English) 
[quảcầu.com](https://xn--qucu-hr5aza.com?utm_source=GitHub+%C2%BB+Obsidian+Hierarchical+Graph+%C2%BB+Readme&utm_medium=Homepage&utm_campaign=Giai+%C4%91o%E1%BA%A1n+1) (Vietnamese) 