
/*
-- Graph Builder --

- input: list of doi, number of generation to grow, selection rule
- output: svg graph, metadata

 */

console.log('-- hello --')

function lastGen(graph){
  /* Return the number of the last generation in the graph */
  function findMax(currentMax, node){ return Math.max( currentMax, node.gen  ) }
  return graph.reduce( findMax, 0 )
}

// test lastGen:
let graph = [{doi:'1234', gen:0, refs:[], citedby:[]},
             {doi:'1234', gen:1, refs:[], citedby:[]}]
console.log( lastGen(graph) )



// function growOneGen( graph ){}
