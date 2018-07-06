/*
-- Graph Builder --

- input: list of doi, number of generation to grow, and a selection rule
- output:
  - a graph i.e. Object like doi:[references]
  - svg graph, metadata

Steps:
1. init a new graph from a list of nodes
2. grow N generations downward
3. select some nodes (max cited)
4. grow a new graph upward from the selected nodes

 */

import * as bibistore from "./bibistore";

interface IGraph {
  [key: string]: {
    gen: number;
    citedby: string[];
  };
}


export function init_graph(doi_list: string[]) {
  /* Create a graph starting at gen0 */
  console.log(`\u{1F3D7} Start a new graph with ${doi_list.length} node(s)`);
  const graph: IGraph = {};
  doi_list.forEach( (doi) => {
    doi = doi.toLowerCase().trim();
    graph[doi] = { gen: 0, citedby: [] };
  });
  return graph;
}

function lastGen(graph: IGraph) {
  /* Return the number of the last generation in the graph */
  function findMax(currentMax: number, key: string) {
    return Math.max(currentMax, graph[key].gen);
  }
  const keys = Object.keys(graph);
  return keys.reduce(findMax, 0);
}

export function growOneGen(graph: IGraph) {
  /* Fetch the references for the last-generation nodes
     and expand the graph one generation
  */

  // Look for the last generation nodes:
  const graphLastgen = lastGen(graph);

  const keys = Object.keys(graph);
  const lastgenDoi = keys.filter( (key) => graph[key].gen == graphLastgen);

  console.log(`\u{1F6B2} Expand generation #${graphLastgen}, ${lastgenDoi.length} sub-nodes.`);

  // Look for the refs:
  const graphPromise = bibistore.getmany( lastgenDoi ).then( (data) => {
      data.forEach( (metadata: bibistore.IMetadata) => {
          const doi = metadata['DOI'].toLowerCase();
          const referenceList = metadata['reference'];
          if ( referenceList ) {
            referenceList.forEach( (info) => {
              // Add node to the graph:
              let refdoi = info["DOI"]
              if (refdoi) {
                refdoi = refdoi.trim().toLowerCase();
                if (graph[refdoi]) {
                  graph[refdoi].citedby.push(doi);
                } else {
                  graph[refdoi] = { gen: graphLastgen + 1, citedby: [doi] };
                }
              } // else: no DOI provided...
            });
        } else { console.log(`\u{1F641}  no ref provided for ${doi}`); }
      });
      return graph;
  });

  return graphPromise;
}

 /* // Perform the query for the unknown references and expand the graph:
  return bibistore.query(missing).then(function() {
    for (let doi of lastgen_doi) {
      const metadata = bibistore.get(doi);

      if (metadata.reference) {
        metadata.reference.forEach(function(info) {
          // Add node to the graph:
          if (info["DOI"]) {
            const refdoi = info["DOI"].trim().toLowerCase();
            if (graph[refdoi]) {
              graph[refdoi].citedby.push(doi);
            } else {
              graph[refdoi] = { gen: graph_lastgen + 1, citedby: [doi] };
            }
          }
        });
      } else {
        console.log("no ref provided");
      }
    }
    return graph;
});*/


export function selectMinimumCited(graph: IGraph, minimumcited: number) {
  const keys = Object.keys(graph);
  return keys.filter( (key) => graph[key].citedby.length >= minimumcited );
}

export function upwardGraph(graph: IGraph, selectednodes: string[]) {
  /* Build the upward graph from the selected nodes
  */
  let nodes: string[] = [];
  let links: [string, string][] = [];

  let nodesToCheck = selectednodes;

  let doi: string;
  while (doi = nodesToCheck.pop()!) {  // see https://github.com/Microsoft/TypeScript/issues/18718 for the !
    nodes.push(doi);
    graph[doi].citedby.forEach( (citingdoi: string) => {
      links.push([doi, citingdoi]);
      if (!nodesToCheck.includes(citingdoi) && !nodes.includes(citingdoi)) {
        nodesToCheck.push(citingdoi);
      }
    });
  }

  return { nodes: nodes, links: links };
}
// Test:
/*
let doi_list = ['10.1103/PhysRevA.62.012306']

let graph = init_graph( doi_list )
console.log('graph init: ', graph)
console.log( "id lastgen: ", lastGen(graph) )
*/
