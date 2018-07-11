<template>
  <div class="graphviewer">

  <div class="graphpanel">
    <svg id='svggraph'></svg>
  </div>

  <div class="rightpanel">
    <a v-if="selectednode" v-on:click="selectednode=null" href='#'>hide metadata</a>
    <metadataviewer v-if="selectednode" v-bind:doi="selectednode"></metadataviewer>
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
    rendergraph(graph){
      console.log(' Do you see a graph? \u{1F986} ')
      console.log(graph)

      // Create a new directed graph
      const g = new dagreD3.graphlib.Graph().setGraph({
        rankdir: 'LR',
      });

      graph.nodes.forEach((doi)=>{
        const metadata = bibistore.get(doi)
        let styles = [];
        if( metadata.referenceWithDOI.length == 0 ){
          styles.push('norefprovided')
        }
        g.setNode(doi, {
          label: metadata.key,
          id: 'doi'+doi.replace(/[\./]/g, ''),
          class:styles.join(' ')
        });
      })

      graph.links.forEach( (links)=>{
        g.setEdge(links[0], links[1], {});

      })
      // Create the renderer
      const render = new dagreD3.render();
      // Set up an SVG group so that we can translate the final graph.
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
      svg.selectAll("g.node").on("click", (id) => {
        const _node = g.node(id);
        // console.log("Clicked ", id, this);
        this.selectednode = id;
        svg.selectAll('.node rect').style("fill", "white"); // TODO: toggle class instead
        svg.selectAll('#doi'+id.replace(/[\./]/g, '')+' rect').style("fill", "#F44");
      });
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

.node rect {
  stroke: #333;
  fill: #fff;
}

.edgePath path {
  stroke: #333;
  fill: #333;
  stroke-width: 1.5px;
}
.node {
  cursor: pointer;
}
.node:hover  {
  color: "#F66";
}

.norefprovided rect { //svg
  fill:rgb(0,0,255);
  stroke-width:3;
}

</style>
