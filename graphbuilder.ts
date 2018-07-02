
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

import * as bibistore from './bibistore'


export function init_graph( doi_list: string[] ){
  /* Create a graph starting at gen0 */
  let graph = {}
  doi_list.forEach(
    function(doi){
      doi = doi.toLowerCase().trim()
      graph[doi] = {gen:0, citedby:[]}
  })
  return graph
}

function lastGen(graph){
  /* Return the number of the last generation in the graph */
  function findMax(currentMax, key){ return Math.max( currentMax, graph[key].gen  ) }
  const keys = Object.keys(graph);
  return keys.reduce( findMax, 0 )
}

export function growOneGen( graph ){
  /* Fetch the references for the last-generation nodes
     and expand the graph one generation
  */

  // Look for the unknown references:
  const graph_lastgen = lastGen(graph)

  const keys = Object.keys(graph);
  const lastgen_doi = keys.filter( key => graph[key].gen==graph_lastgen )
  console.log('lastgen doi:', lastgen_doi.length)

  const stored = bibistore.stored_doi_list()
  const missing = lastgen_doi.filter( doi => bibistore.get(doi) == null )
  console.log('missing: ', missing.length)

  // TODO: if missing empty?

  // Perform the query for the unknown references and expand the graph:
  return bibistore.query( missing ).then( function(){
    for (let doi of lastgen_doi) {
        const metadata = bibistore.get(doi)

        if( metadata.reference ){
          metadata.reference
              .forEach(function(info){

                // Add node to the graph:
                if( info['DOI'] ){
                  const refdoi = info['DOI'].trim().toLowerCase()
                  if( graph[refdoi] ){ graph[refdoi].citedby.push(doi) }
                  else{ graph[refdoi] = {gen: graph_lastgen+1, citedby: [doi]} }
                }

              })

        } else {
          console.log('no ref provided')
        }
    }
    return graph
  })

}


export function select_minimumcited(graph, minimumcited:number ){
  const keys = Object.keys(graph);
  return keys.filter( key=> graph[key].citedby.length >= minimumcited  )
}


export function upward_graph( graph, selectednodes ){
  let nodes = []
  let links = []

  let nodes_to_check = selectednodes

  while( nodes_to_check.length ){
    const doi = nodes_to_check.pop()
    nodes.push(doi)

    graph[doi].citedby.forEach(function(citingdoi){

      links.push( [doi, citingdoi] )
      if( !nodes_to_check.includes(citingdoi) && !nodes.includes(citingdoi)  ){
        nodes_to_check.push( citingdoi )
      }
    })

  }

  return {nodes:nodes, links:links}

}
// Test:
/*
let doi_list = ['10.1103/PhysRevA.62.012306']

let graph = init_graph( doi_list )
console.log('graph init: ', graph)
console.log( "id lastgen: ", lastGen(graph) )
*/
