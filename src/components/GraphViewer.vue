<template>
  <div class="graphviewer">
    <h2>graph</h2>
    <svg width=500 height=400></svg>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as d3 from 'd3';
import dagreD3 from 'dagre-d3';


export default Vue.extend({
  name: 'GraphViewer',
  props: ['graph'],
  mounted:function(){
    console.log(' Do you see a graph? \u{1F986} ')
    console.log(this.graph)

    // Create a new directed graph
    const g = new dagreD3.graphlib.Graph().setGraph({
      rankdir: 'LR',
    });

    this.graph.nodes.forEach((doi)=>{
      g.setNode(doi, {
        label: doi,
      });
    })

    this.graph.links.forEach( (links)=>{
      g.setEdge(links[0], links[1], {});

    })



    // Create the renderer
    const render = new dagreD3.render();
    // Set up an SVG group so that we can translate the final graph.
    const svg = d3.select('svg');
    const svgGroup = svg.append('g');

    const gr = d3.select('svg>g')
    gr.length = 1 // hack
    // Run the renderer. This is what draws the final graph.
    render(gr, g);
    // Center the graph
    var xCenterOffset = (Number(svg.attr('width')) - g.graph().width) / 2;
    svgGroup.attr('transform', 'translate(' + xCenterOffset + ', 20)');
    svg.attr('height', g.graph().height + 40);

    // Set up zoom support
    var zoom = d3.zoom().on("zoom", function() {
          svgGroup.attr("transform", d3.event.transform);
        });
    svg.call(zoom);

    // Center the graph
    const initialScale = 0.75;
    let w = Number(svg.attr("width"));
    svg.call(zoom.transform, d3.zoomIdentity.translate((w - g.graph().width * initialScale) / 2, 20).scale(initialScale));

    svg.attr('height', g.graph().height * initialScale + 40);

  }
});



</script>


<style>
svg {
  border: solid 1px black;
  width: 100%;
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

</style>
