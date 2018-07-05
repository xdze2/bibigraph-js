
/*
-- Graph Builder --

- input: list of doi, number of generation to grow, and a selection rule
- output:
  - a graph i.e. Object like doi:[references]
  - svg graph, metadata
 */

import * as graphbuilder from './graphbuilder'


const shortdoilist =  ['10.1103/physreva.51.1015', '10.1143/jpsj.43.1262', '10.1109/tdei.2009.4784550',
'10.1038/30156', '10.1103/physrevlett.1.275', '10.1080/00107519608217543']

let graph = graphbuilder.init_graph( shortdoilist )

graphbuilder.growOneGen( graph ).then( (graph) => {
    const nodes = graphbuilder.selectMinimumCited(graph, 2)
    console.log('upward graph:', graphbuilder.upwardGraph( graph, nodes ) )
})
/*  .then( graph=>graphbuilder.growOneGen( graph ) )
  .then( function(graph){
    let nodes = graphbuilder.select_minimumcited(graph, 4)
    console.log('nodes selected', nodes)

    console.log('upward', graphbuilder.upward_graph( graph, nodes ) )

}) */
