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
  props: ['doilist'],
  created (){
      this.buildGraph(this.doilist);
  },
  data (){ return {
      log: ['\u{1F3ED}  hello'],
      graph: undefined,
  }; },
  computed: {
  },
  methods: {

    buildGraph(doilist: string[]) {
      this.log.push( 'new graph started...' )
      console.log('selected nodes: ', doilist);

      const graph = graphbuildingmachine.init_graph( doilist );

      graphbuildingmachine.growOneGen( graph )
        .then( (graph) => graphbuildingmachine.growOneGen( graph ) )
        .then( (graph) => {
          const nodes = graphbuildingmachine.selectMinimumCited(graph, 5);
          const nodelinks = graphbuildingmachine.upwardGraph( graph, nodes );
          console.log('upward graph: ', nodelinks );
          this.log.push( 'upward graph...' )

          EventBus.$emit('graphfinished', nodelinks);
          this.log.push( 'done' )
        });

    },
  },
  components: {
  }
});
</script>


<style scoped>

textarea {
  width: 60%;
  height: 10em;
}
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

</style>
