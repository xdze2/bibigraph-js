
/*
-- Graph Builder --

- input: list of doi, number of generation to grow, and a selection rule
- output:
  - a graph i.e. Object like doi:[references]
  - svg graph, metadata
 */

import * as graphbuilder from './graphbuilder';


const doi_list = ['10.1103/PhysRevA.62.012306'];
const graph = graphbuilder.init_graph( doi_list );

graphbuilder.growOneGen( graph )
  .then( (graph) => graphbuilder.growOneGen( graph ) )
  .then( function(graph) {
    const nodes = graphbuilder.select_minimumcited(graph, 4);
    console.log('nodes selected', nodes);

    console.log('upward', graphbuilder.upward_graph( graph, nodes ) );

  });
