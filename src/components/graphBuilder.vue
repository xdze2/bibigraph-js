<template>
<div class="graphBuilder" >


<div class="messageboard">
  <p v-for="line of log">{{line}}</p>
</div>

</div>
</template>

<script lang="ts">
import Vue from 'vue';
import {EventBus} from '../main';

import * as graphbuildingmachine from '../modules/graphbuilder';

export default Vue.extend({
  name: 'graphBuilder',
  props: ['graphspec'],
  created (){
      this.buildGraph(this.graphspec);
  },
  data (){ return {
      log: ['\u{1F3ED}  hello'],
      graph: undefined,
  }; },
  computed: {
  },
  methods: {
    pushLog(message:string){
      this.log.push( message )
    },
    buildGraph(graphspec) {
      this.pushLog( 'Start a new graph...' )
      this.pushLog( `from ${graphspec.doilist.length} selected nodes, for 2 gen` );

      const graph = graphbuildingmachine.init_graph( graphspec.doilist );

      graphbuildingmachine.growOneGen( graph )
        .then( (graph) => graphbuildingmachine.growOneGen( graph ) )
        .then( (graph) => {
          // select:
          let nodes = graphbuildingmachine.selectTopCited(graph, graphspec.ntop);
          console.log('selected nodes: ', nodes );
          // upward:
          const nodelinks = graphbuildingmachine.upwardGraph( graph, nodes );
          console.log('upward graph: ', nodelinks );

          this.pushLog( 'upward graph build' )
          this.pushLog( 'done' )

          const graphobj = {
            nodes: nodelinks.nodes.map( (doi) => {
              const g = graph[doi];
              g.doi = doi;
              return g;
            } ),
            links: nodelinks.links,
            secondary: nodelinks.secondary,
          };
          EventBus.$emit('graphfinished', graphobj);

        });

    },
  },
  components: {
  }
});
</script>


<style scoped>

.messageboard {
  width: 60em;
  height:10em;
  background-color: #666;
  color:#fafafa;
  padding:10px;
  border-radius:3px;
  box-shadow: inset 1px 2px 3px #4a4a4a;
}
.messageboard p {
  margin: 0;
  padding: 0;
}
.graphBuilder{
  padding: 5px;
  margin-left: 2em;
  margin-top: 1em;
}
</style>
