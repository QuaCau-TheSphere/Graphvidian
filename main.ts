import { Plugin } from 'obsidian';
const fs = require('fs');
export default class MyPlugin extends Plugin {
	async onload() {
		//Reading Breadcrumbs database
		console.clear()
		var gvstyle = {
			Giaiphap: {
				node: "shape=plaintext style=filled, rounded fontname=\"Lato\"  margin=0.2",
				edge: "" 
			},
			Dichung: {
				node: "shape=plaintext style=filled, rounded fontname=\"Lato\"  margin=0.2",
				edge: "" 
			},
			Ytuongtothon: {
				node: "shape=plaintext style=filled, rounded fontname=\"Lato\"  margin=0.2",
				edge: "" 
			},
			Yeutohotro: {
				node: "shape=plaintext style=filled, rounded fontname=\"Lato\"  margin=0.2",
				edge: "" 
			},
			Thamkhao: {
				node: "shape=plaintext style=filled, rounded fontname=\"Lato\"  margin=0.2",
				edge: "" 
			},
		}
		const typeKeys = Object.keys(gvstyle)
		var edgesByID = this.app.plugins.plugins.breadcrumbs.mainG.toJSON().edges
		
		//Restructuring the Breadcrumbs database: from sorting by edge ID to sorting by edge type
		var edgesByType = [] 
		typeKeys.forEach(edgetype => {
			var tmp1 = {
				type: edgetype,
				edges: [],
			} 	
			edgesByID.forEach(edge => {
				if (edge.attributes.field == edgetype) {
					var tmp2 = {
						source: edge.source,
						dir: edge.attributes.dir,
						target: edge.target,
						id: edge.key,
					} 
					tmp1.edges.push(tmp2) 
				} 
			} );
			edgesByType.push(tmp1) 
		})
		//console.log(edgesByType)
		
		//Start making dot file
		const wrap = (s) => s.replace(/(?![^\n]{1,32}$)([^\n]{1,32})\s/g, '$1\n');
		var dotoutput = "digraph G {\n" 
		typeKeys.forEach(edgetype => {
			dotoutput += `\n//NODES AND EDGES FOR ${edgetype}\n\n` ;
			
			const edgeList = edgesByType.filter(item => item.type == edgetype)[0].edges
			//Print all target nodes of all edges with that type
			dotoutput += `node [ ${gvstyle[edgetype].node} ]\n`
			edgeList.forEach(edge => {
				var nodelabel = wrap(edge.target)
				dotoutput += `"${edge.target}" [ label = "${nodelabel}" ] \n`
			} 
			) 
			
			//Print all edges with that type
			dotoutput += `\nedge [ ${gvstyle[edgetype].edge} ]\n`
			edgeList.forEach (edge => dotoutput += `"${edge.source}" -> "${edge.target}"\n`
			);
		})
		dotoutput += `\n}`
		console.log(dotoutput)
		// console.log('captures/' + getFileName())
		// var configPath = this.app.vault.configDir + "/plugins/dotmaker/data.json";
		// this.app.vault.getAbstractFileByPath(configPath) 
		// var jsonContent = JSON.stringify(json); 
		// console.log(jsonContent)
		// this.app.vault.modify("output2.json", dotoutput);
		// fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
		// 	if (err) {
		// 		console.log("An error occured while writing JSON Object to File.");
		// 		return console.log(err);
		// 	}
		// 	console.log("JSON file has been saved.");
		// });
		console.log('done')
	}
	onunload() {
		console.log('unloading plugin')
	}
}
