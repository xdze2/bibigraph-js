
import * as tr from './transitiveReduction'

// const links = [
//       ['a', 'c'],
//       ['a', 'b'],
//       ['a', 'd'],
//       ['d', 'e'],
//       ['a', 'e'],
//       ['c', 'f'],
//       ['c', 'g'],
//       ['g', 'h'],
//       ['h', 'a'],
//       ['i', 'd'],
//       ['f', 'b'],
//       ['h', 'c'],
//       ['b', 'c']
//   ]

// const links = [
//       ['a', 'b'],
//       ['b', 'c'],
//       ['c', 'a'],
//       ['b', 'd']
//   ]

const links: Array<[string, string]> = [
  ['a', 'b'],
  ['a', 'c'],
  ['b', 'c'],
]

console.log('links: ', links)
// console.log('adj: ', tr.adjacency(links))

// console.log('back edge: ', tr.searchBackEdge(links))

// console.log('without cycle: ', tr.removeCycle(links))

// const [adj, nodes] = tr.adjacency(links);
// const dag = tr.removeCycle(links)
// const TC = tr.transitiveClosure(nodes, dag)
// console.log('TC: ',  TC)
//
// const TR = tr.transitiveReduction( nodes, TC )
// console.log('TR: ', TR )

const F = tr.graphreduce( links )
console.log('Final: ', F )
