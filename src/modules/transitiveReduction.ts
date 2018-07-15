/* Compute the transitve reduction of a directed graph

Refs:
An algorithm for transitive reduction of an acyclic graph
David Gries Alain J.Martin Jan L.A.van de Snepscheut Jan TijmenUdding
https://www.sciencedirect.com/science/article/pii/0167642389900397

MIT 6.006 Introduction to Algorithms, Fall 2011
14. Depth-First Search (DFS), Topological Sort
https://www.youtube.com/watch?v=AfSk24UTFS8

https://en.wikipedia.org/wiki/Transitive_closure
https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm

Steps:
1. Remove back edge (cycle) using DFS
2. Build the transitve closure (all readachable node) (time N3)
3. Get the Transitive Reduction by removing edges with secondary path

input: list of links

*/

interface Iadj {
  [key: string]: string[];
}

export function adjacency(links: Array<[string, string]>): [Iadj, Set<string>] {
  /* Build the adjacency matrix {source: [target, ...], ...}
     Return also the set of nodes
  */
  const adj: Iadj = {};
  const nodes: Set<string> = new Set();

  for (const st of links) {
    const [s, t] = st;
    if (adj[s]) {
      adj[s].push(t);
    } else {
      adj[s] = [t];
    }
    nodes.add(s);
    nodes.add(t);
  }

  return [adj, nodes];
}

function dfs_visit(adj, u, visited, finished, backedge) {
  for (const v of adj[u] || []) {
    if (!visited.has(v)) {
      visited.add(v);
      dfs_visit(adj, v, visited, finished, backedge);
    } else if (!finished.has(v)) {
      backedge.add([u, v].join("_edge_"));
    }
  }
  finished.add(u);
}

function searchBackEdge(adj: Iadj) {
  /* Look for loop using a DFS on the graph
  */
  const visited = new Set();
  const finished = new Set();
  const backedge = new Set();
  for (const u of Object.keys(adj)) {
    if (!visited.has(u)) {
      visited.add(u);
      dfs_visit(adj, u, visited, finished, backedge);
    }
  }
  return backedge;
}

export function transitiveClosure(nodes: Set<string>, links: Array<[string, string]>) {
  /* Compute the transitve closure (Floyd–Warshall algorithm)
      return a set of concatenated links: s_edge_t
  */
  const TC = new Set(links.map(edge => edge.join("_edge_")));

  for (const k of nodes) {
    for (const s of nodes) {
      const sk = [s, k].join("_edge_");
      for (const t of nodes) {
        if (s === t) {
          continue;
        }
        const st = [s, t].join("_edge_");
        const kt = [k, t].join("_edge_");
        if (!TC.has(st) && TC.has(sk) && TC.has(kt)) {
          TC.add(st);
        }
      }
    }
  }
  return TC;
}

function transitiveReduction(nodes: Set<string>, TC: Set<string>) {
  /* input: TR is the transitve closure returned by `transitiveClosure()` */
  const TR = new Set(TC);

  for (const st of TC) {
    const [s, t] = st.split("_edge_");
    for (const k of nodes) {
      const sk = [s, k].join("_edge_");
      const kt = [k, t].join("_edge_");
      if (TC.has(sk) && TC.has(kt)) {
        TR.delete(st);
      }
    }
  }
  return TR;
}

export function graphreduce(links: Array<[string, string]>) {
  /* Return the transitve reduction of the graph
    input: list of links [source, target]
   */
  const [adj, nodes] = adjacency(links);

  const backedge = searchBackEdge(adj);
  const dag = links.filter(edge => !backedge.has(edge.join("_edge_")));
  const TC = transitiveClosure(nodes, dag);
  const TR = transitiveReduction(nodes, TC);

  return  Array.from(TR).map( (edge) => edge.split('_edge_') );
}
