
/*
-- Graph Builder --

- input: list of doi, number of generation to grow, selection rule
- output: svg graph, metadata

 */

import * as bibistore from './bibistore'

console.log('-- hello --')

function lastGen(graph){
  /* Return the number of the last generation in the graph */
  function findMax(currentMax, key){ return Math.max( currentMax, graph[key].gen  ) }
  const keys = Object.keys(graph);
  return keys.reduce( findMax, 0 )
}


function init_graph( doi_list: string[] ){
  /* Create a graph starting at gen0 */
  let graph = {}
  doi_list.forEach(
    function(doi){
    doi = doi.toLowerCase().trim()
    graph[doi] = {gen:0, citedby:[]}
  })
  return graph
}


// - function growOneGen( graph ){}
function growOneGen( graph ){
  /* Fetch the references for the last-generation nodes
     and expand the graph one generation
  */
  const graph_lastgen = lastGen(graph)

  const keys = Object.keys(graph);
  const lastgen_doi = keys.filter( key => graph[key].gen==graph_lastgen )
  console.log('lastgen doi:', lastgen_doi)

  const stored = bibistore.stored_doi_list()
  const missing = lastgen_doi.filter( doi => bibistore.get(doi) == null )
  console.log('missing: ', missing.length)

  // TODO: if missing empty?

  return bibistore.query( missing ).then( function(){
    for (let doi of lastgen_doi) {
        const metadata = bibistore.get(doi)

        if( metadata.reference ){
          metadata.reference
              .forEach(function(info){

                if( info['DOI'] ){
                  const refdoi = info['DOI'].trim().toLowerCase()
                  // Add node to the graph:
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

// Test:
let doi_list = ['10.1103/PhysRevA.62.012306']

let graph =  init_graph( doi_list )
console.log('graph init: ', graph)
console.log( "id lastgen: ", lastGen(graph) )

growOneGen( graph )
  .then( graph=>growOneGen( graph ) )
  .then( graph=>console.log('graph then', graph) )
