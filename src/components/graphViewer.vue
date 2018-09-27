<template>
  <div class="graphviewer">

<div class='toolbar'>
  <a href='#' v-on:click="rendergraph()">render</a><br />
  <input type="checkbox" id="drawsecondary" v-model="drawsecondary"> draw secondary
</div>

  <div class="graphpanel">
    <svg id='svggraph' height="100%" width="100%"></svg>
  </div>



  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as bibistore from '../modules/bibistore';
import * as d3 from 'd3';
import dagreD3 from 'dagre-d3';
import {EventBus, graph} from '../main';

import * as builder from '../modules/graphbuilder';
import {graphreduce} from '../modules/transitiveReduction';

export default Vue.extend({
  name: 'GraphViewer',
  props: [],
  data(){ return {
    selectednode: null,
    nodes: graph.state.nodelist,
    drawsecondary: true,
    //graph: undefined,
  }},
  mounted(){
    //this.rendergraph()
    // EventBus.$on('graphfinished', (graph) => {
    //     console.log('get event graphfinished')
    //     //this.graph = graph;
    //     this.rendergraph(graph);
    // });
  },
  updated() {
    console.log('graph view update!')
    //this.rendergraph(this.graph)
  },
  watch: {
    drawsecondary: function(){
      console.log('hello, prop watched')
      this.rendergraph()
    },
    nodes: function(){
      console.log('render!')
      this.rendergraph()
    },
  },
  methods: {
    doiToCssID(doi){
      doi = doi.replace(/[\./]/g, '');
      return `doi${doi}`
    },
    rendergraph(){



      console.log(' Do you see a graph? \u{1F986} ')

      if(this.nodes.length == 0){
        console.log('zero node')
        return 0
      }

      // Create a new directed graph
      const g = new dagreD3.graphlib.Graph().setGraph({
        rankdir: 'LR'
      });

      // Append the nodes:
      this.nodes.forEach( (node)=>{

        const metadata = bibistore.get([node])[0];
        const doi = metadata.doi;
        const gen = 1;  // what?

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
      const [links, secondary] = this.getLinks()

      if(this.drawsecondary){
        secondary.forEach( (links)=>{
          g.setEdge(links[0], links[1], {
            curve: d3.curveBasis,
            style: "stroke: #777; fill:none; stroke-width: 1px;",
            weight: .05,
          });
        })
      }
      links.forEach( (link)=>{
        g.setEdge(link[0], link[1], {
          curve: d3.curveBasis,
          style: "stroke: #001; fill:none; stroke-width: 2px;",
          weight: 1,
        });
      })


      // Create the renderer
      const render = new dagreD3.render();
      const svg = d3.select('svg');
      svg.selectAll("*").remove(); // init

      const svgGroup = svg.append('g');

      const gr = d3.select('svg>g')
      gr.length = 1 // non working hack
      // Run the renderer. This is what draws the final graph.
      render(gr, g);

      // Center the graph
      const svgBBox = svg.node().getBoundingClientRect()
      const [svgwidth, svgheight] = [svgBBox.width, svgBBox.height]
      const [graphwidth, graphheight] = [g.graph().width, g.graph().height]

      const initialScale = .96*Math.min( svgwidth/graphwidth, svgheight/graphheight );

      const x_offset = (svgwidth - initialScale*graphwidth)/2
      const y_offset = (svgheight - initialScale*graphheight)/2

      svgGroup.attr('transform', `translate( ${x_offset}, ${y_offset}) scale(${initialScale})`)

      // Set up zoom support
      var zoom = d3.zoom().on("zoom", function() {
            svgGroup.attr("transform", d3.event.transform);
          });
      svg.call(zoom);

      zoom.scaleExtent([initialScale, initialScale*4]);


      // click node:
      svg.selectAll("g.node")
        .on("click", (id) => {
          const _node = g.node(id);
          // console.log("Clicked ", id, this);
          this.selectednode = id;
          EventBus.$emit('showmetadata', id);
          svg.selectAll('.node').classed('selected', false);
          svg.selectAll('#'+this.doiToCssID(id)).classed('selected', true);
        });

      // additional styles
      svg.selectAll(".node rect")
        .attr('rx', "3")
        .attr('ry', "3");

      if(this.selectednode){
        svg.selectAll('#'+this.doiToCssID(this.selectednode)).classed('selected', true);
      }

      // svg.selectAll(".node")
      //   .append("circle").attr("cx", 0).attr("cy", 0).attr("r", 10)
    },
    getLinks(){
      const alllinks = builder.addLinks(this.nodes)
      const [TR, secondary] = graphreduce(alllinks);
      return [TR, secondary];
    },
  },
  components: {
  }
});



</script>


<style>
svg {
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
  fill: red;
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
/* .rightpanel {
  position: absolute;
  top:5px;
  right: 2px;
  bottom: 5px;
  width:400px;

  padding:5px;

  overflow: scroll;
  overflow-x: auto;

}
 */
.graphviewer {
  position: relative;
  /* height:100%; */
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  height: 100%;
}
.toolbar {
  position: absolute;
  top:10px;
  right: 10px;
  /* border: solid 2px #F44; */
}
.graphpanel {
  flex: 1;
  margin: 3px;
  /* height:100%; */
  box-sizing: border-box;
  border: solid 1px black;
  box-shadow: inset 3px 3px 6px 0px #e5e5e4;
}

</style>
