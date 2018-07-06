<template>
<div class="requestform" >
<h1>bibigraph</h1>

<div v-if='!busy'>
  <textarea v-model="doitext" placeholder="give a doi list, comma or space separated"></textarea>
  <button v-on:click="submit(doitext)">go</button>

  <p>
  <span v-for="doi in doilist">[{{ doi }}]  </span>
  </p>

  <p>
    <a href='#' v-on:click="doitext='10.1103/PhysRevA.62.012306'">set example 1</a>,
    <a href='#' v-on:click="doitext='10.1103/PhysRevA.62.012306, PhysRevA.62.012306Cc1R1'">set example 2</a>,
    <a href='#' v-on:click="doitext='10.1103/physreva.51.1015, 10.1143/jpsj.43.1262,10.1109/tdei.2009.4784550,10.1038/30156,10.1103/physrevlett.1.275, 10.1080/00107519608217543'">example 3</a>
  </p>

</div>
<div v-else>
  busy - look at the console...
</div>

<p>{{graph}}</p>

</div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as graphbuilder from '../modules/graphbuilder';

export default Vue.extend({
  name: 'requestform',
  data: () => { return {
      doitext: '',
      busy: false,
      graph: undefined,
  }; },
  computed: {
    doilist: function () { return this.doitext.split(/[,;\s]/).filter( (x) => x ) },
  },
  methods: {
    submit(doitext: string) {
      this.busy = true;
      this.graph = undefined;

      const doilist = doitext.split(/[,;\s]/).filter( (x) => x );
      
      console.log('selected nodes: ', doilist);

      const graph = graphbuilder.init_graph( doilist );

      graphbuilder.growOneGen( graph )
        .then( (graph) => graphbuilder.growOneGen( graph ) )
        .then( (graph) => {
          const nodes = graphbuilder.selectMinimumCited(graph, 2);
          console.log('nodes selected: ', nodes);
          const nodelinks = graphbuilder.upwardGraph( graph, nodes );
          console.log('upward graph: ', nodelinks );
          this.graph = nodelinks;
          // reset
          this.busy = false;
          this.doitext = '';
        });

    },
  },
});
</script>


<style scoped>

textarea {
  width: 60%;
  height: 10em;
}

</style>
