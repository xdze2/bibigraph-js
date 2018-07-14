<template>
  <div class="graphviewer">

  <div class="graphpanel">
    <svg id='svggraph'></svg>
  </div>

  <div class="rightpanel">
    <!-- <a v-if="selectednode" v-on:click="selectednode=null" href='#'>hide metadata</a> -->
    <metadataviewer v-if="selectednode" v-bind:doi="selectednode" v-bind:graph="graph" >
    </metadataviewer>
  </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import metadataviewer from './metadataViewer'
import * as bibistore from '../modules/bibistore';
import * as d3 from 'd3';
import dagreD3 from 'dagre-d3';
import { EventBus } from '../main';

export default Vue.extend({
  name: 'GraphViewer',
  props: ['graph'],
  data(){return {
    selectednode: null,
    //graph: undefined,
  }},
  mounted(){
    this.rendergraph(this.graph)
    // EventBus.$on('graphfinished', (graph) => {
    //     console.log('get event graphfinished')
    //     //this.graph = graph;
    //     this.rendergraph(graph);
    // });
  },
  beforeUpdate() {

  },
  methods: {
    doiToCssID(doi){
      doi = doi.replace(/[\./]/g, '');
      return `doi${doi}`
    },
    rendergraph(graph){
      console.log(' Do you see a graph? \u{1F986} ')
      console.log(graph)

      // Create a new directed graph
      const g = new dagreD3.graphlib.Graph().setGraph({
        rankdir: 'LR',
      });

      // Append the nodes:
      graph.nodes.forEach( (node)=>{
        const doi = node.doi;
        const metadata = bibistore.get(doi);
        const gen = node.gen;

        // label
        const key = metadata ? metadata.key : doi ;
        const label = `${key}`

        let styles = [];
        if( !metadata || metadata.referenceWithDOI.length == 0 ){
          styles.push('norefprovided')
        }
        styles.push(`gen${gen}`)
        g.setNode(doi, {
          label: label,
          id: this.doiToCssID(doi),
          class: styles.join(' '),
          // labelType: "html",
          // width: 300,
          // height: 30,
        });
      })

      // Appends the links:
      graph.links.forEach( (links)=>{
        g.setEdge(links[0], links[1], {});

      })

      // Create the renderer
      const render = new dagreD3.render();
      const svg = d3.select('svg');
      const svgGroup = svg.append('g');

      const gr = d3.select('svg>g')
      gr.length = 1 // non working hack
      // Run the renderer. This is what draws the final graph.
      render(gr, g);
      // Center the graph
      var xCenterOffset = (Number(svg.attr('width')) - g.graph().width) / 2;
      svgGroup.attr('transform', 'translate(' + xCenterOffset + ', 20)');
      //svg.attr('height', g.graph().height + 40);

      // Set up zoom support
      var zoom = d3.zoom().on("zoom", function() {
            svgGroup.attr("transform", d3.event.transform);
          });
      svg.call(zoom);

      zoom.scaleExtent([.2, 3]);

      // Center the graph
      const initialScale = 0.75;
      let w = Number(svg.attr("width"));
      svg.call(zoom.transform, d3.zoomIdentity.translate((w - g.graph().width * initialScale) / 2, 20).scale(initialScale));

      //svg.attr('height', g.graph().height * initialScale + 40);

      // click node:
      svg.selectAll("g.node")
        .on("click", (id) => {
          const _node = g.node(id);
          // console.log("Clicked ", id, this);
          this.selectednode = id;
          svg.selectAll('.node').classed('selected', false);
          svg.selectAll('#'+this.doiToCssID(id)).classed('selected', true);
        });

      // additional styles
      svg.selectAll(".node rect")
        .attr('rx', "3")
        .attr('ry', "3");

      // svg.selectAll(".node")
      //   .append("circle").attr("cx", 0).attr("cy", 0).attr("r", 10)
    },
  },
  components: {
    metadataviewer,
  }
});



</script>


<style>
svg {
  border: solid 1px black;
  width: 100%;
  height: 100%;

}

 /* graph  */
 /* color code svg
 https://www.graphviz.org/doc/info/colors.html
 */

svg .node {
  cursor: pointer;
}
svg .node rect {
  stroke-width:.5;
  stroke: #222;
  transition: all .1s;
}
svg .node:hover rect {
  filter: drop-shadow( 1px 1px 4px #888 );
}
svg .node.gen0 rect {
  fill: tomato;
}
svg .node.gen1 rect {
  fill: chartreuse;
}
svg .node.gen2 rect {
  fill: gold;
}
svg .node.selected rect {
  filter: drop-shadow( 1px 1px 6px #ff5588 );
}
/* svg .node.selected:hover rect {
  filter: drop-shadow( 1px 1px 4px #ff5588 );
} */
svg .node.norefprovided rect {
  stroke-width:3;
  stroke: red;
}


.edgePath path {
  stroke: #333;
  fill: #333;
  stroke-width: 1.5px;
  /* filter: drop-shadow( 1px 1px 2px #222 ); */
}

/* foreignObject div {
  font-family: monospace;
  font-size: 25px;
  border: 1px solid black;
  width: 100%;
  height: 100%;
  background-color: blue;
} */

/* Page layout */
.rightpanel {
  position: absolute;
  top:5px;
  right: 2px;
  bottom: 5px;
  width:400px;

  padding:5px;

  overflow: scroll;
  overflow-x: auto;

}

.graphpanel {
  position: absolute;
  top:5px;
  left: 5px;
  bottom: 8px;
  right:420px;

  box-sizing: border-box;
  box-shadow: inset 2px 3px 6px 0px #e5e5e4;
}

</style>
