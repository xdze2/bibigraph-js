<template>
  <div class="requestform">

    <h1>hello</h1>

    <textarea v-model="doitext" placeholder="give a doi list, comma or space separated"></textarea>
    <button v-on:click="submit(doitext)">go</button>

<p>
{{ doitext }}
</p>

<p>
  <a href='#' v-on:click="doitext='10.1103/PhysRevA.62.012306'">set example 1</a>,
  <a href='#' v-on:click="doitext='10.1103/PhysRevA.62.012306, PhysRevA.62.012306Cc1R1'">set example 2</a>
</p>

<p v-if="status">{{ status }}</p>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as graphbuilder from '../modules/graphbuilder'

export default Vue.extend({
  name: 'requestform',
  data: function(){ return {
      doitext: '',
      status: ''
  }},
  methods: {
    submit: function(doitext){
      let doi_list = doitext.split(/[,;\s]/).filter( x=>x );
      console.log('hello', doi_list)
      this.status = 'go'
      const _this = this
      let graph = graphbuilder.init_graph( doi_list )

      graphbuilder.growOneGen( graph )
        .then( graph=>graphbuilder.growOneGen( graph ) )
        .then( function(graph){
          let nodes = graphbuilder.select_minimumcited(graph, 4)
          console.log('nodes selected', nodes)
          let nodelinks = graphbuilder.upward_graph( graph, nodes )
          console.log('upward', nodelinks )
          _this.status = nodelinks
        })

    },
  }
});
</script>


<style scoped>

</style>
