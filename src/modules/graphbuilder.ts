/*
Graph Builder
=============

- input: list of doi, number of generation to grow, and a selection rule
- output:
  - a graph i.e. Object like {doi:[references], ... }
  - svg graph, metadata

Steps:
1. init a new graph from a list of nodes
2. grow N generations downward
3. select some nodes (max cited)
4. grow a new graph upward from the selected nodes

 */

import * as bibistore from "./bibistore";
import {graphreduce} from './transitiveReduction';
import _ from 'lodash';

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
  *  and expand the graph one generation
  */
  // if{!logfunction}{
  //   console.log('no log function provided')
  //   const logfunction = console.log
  // }
  // Look for the last generation nodes:
  const graphLastgen = lastGen(graph);

  const keys = Object.keys(graph);
  const lastgenDoi = keys.filter( (key) => graph[key].gen == graphLastgen);

  console.log(`\u{1F6B2} Expand generation #${graphLastgen}, ${lastgenDoi.length} sub-nodes.`);

  // Look for the refs:
  const graphPromise = bibistore.getmany( lastgenDoi ).then( (data) => {
      data.forEach( (metadata: bibistore.IMetadata) => {
          const doi = metadata.doi.toLowerCase();
          const referenceList = metadata.referenceWithDOI;
          if ( referenceList ) {
            referenceList.forEach( (refdoi) => {
              // Add node to the graph:
                refdoi = refdoi.trim().toLowerCase();
                if (graph[refdoi]) {
                  graph[refdoi].citedby.push(doi);
                } else {
                  graph[refdoi] = { gen: graphLastgen + 1, citedby: [doi] };
                }
            });
        } else { console.log(`\u{1F641}  no ref provided for ${doi}`); }
      });
      return graph;
  });

  return graphPromise;
}

// Selection rules:

export function selectMinimumCited(graph: IGraph, minimumcited: number) {
  const keys = Object.keys(graph);
  const remainingNodes = keys.filter( (key) => graph[key].citedby.length >= minimumcited );
  console.log(`\u{1F989}  Keep nodes with a minimum of ${minimumcited} citations: ${remainingNodes.length} nodes remaining`);
  return remainingNodes;
}

export function selectTopCited(graph: IGraph, ntop: number){
  /* Sort the nodes by their 'in-graph' citation count
  *  and keep the n at the top
  */
  const keys = Object.keys(graph);
  keys.sort( (a, b) => graph[b].citedby.length - graph[a].citedby.length  )
  return keys.slice(0, ntop)
}

// --

export function upwardGraph(graph: IGraph, selectednodes: string[]) {
  /* Build the upward graph from the selected nodes */

  console.log(`\u{1F680} building the upward graph`);

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

  const [TR, secondary] = graphreduce(links);
  return { nodes: nodes, links: TR, secondary:secondary };
}



export function addLinks(nodes: string[]) {
  /* find the links between the nodes */

  let links: [string, string][] = [];

  nodes = nodes.map( (doi) => doi.toLowerCase() )

  bibistore.get(nodes).forEach( (metadata) => {
    const parent = metadata.doi;
    const refs = metadata.referenceWithDOI.filter( (doi) =>  _.includes(nodes, doi.toLowerCase()));
    console.log('len refs in :', refs.length)
    refs.forEach( (ref) => {
      links.push([ref.toLowerCase(), parent.toLowerCase()])
    })
  })

  //const [TR, secondary] = graphreduce(links);
  return links//{ nodes: nodes, links: TR, secondary:secondary };
}
