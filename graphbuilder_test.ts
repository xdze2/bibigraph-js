
/*
-- Graph Builder --

- input: list of doi, number of generation to grow, and a selection rule
- output:
  - a graph i.e. Object like doi:[references]
  - svg graph, metadata
 */

import * as graphbuilder from './graphbuilder'


let doi_list = ['10.1103/PhysRevA.62.012306']
let graph = graphbuilder.init_graph( doi_list )

graphbuilder.growOneGen( graph )
  .then( graph=>graphbuilder.growOneGen( graph ) )
  .then( function(graph){
    let nodes = graphbuilder.select_minimumcited(graph, 4)
    console.log('nodes selected', nodes)
  })
