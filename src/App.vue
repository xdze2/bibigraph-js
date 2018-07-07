<template>
<div id="app">
  <h1>bibigraph</h1>
<p class='debug'>state: {{state}}</p>
<a href="#" v-if="state=='view'" v-on:click="state='request'">[new graph]</a>
<a href="#" v-else-if="graph" v-on:click="state='view'">[cancel]</a>

<requestform v-if="['request'].includes(state)"></requestform>
<graphbuilder v-if="state=='building'" v-bind:doilist="doilist"></graphbuilder>

<graphviewer v-if="state=='view'" v-bind:graph="graph"></graphviewer>

</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { EventBus } from './main';

import requestform from '@/components/requestform.vue';
import graphbuilder from '@/components/graphBuilder.vue';
import graphviewer from '@/components/graphViewer.vue';
// @ is an alias to /src

// <graphviewer v-if="graph" v-bind:graph="graph" />


export default Vue.extend({
  name: 'home',
  components: {
    requestform,
    graphbuilder,
    graphviewer,
  },
  data(){ return {
    state: 'request',
    graph: undefined,
  }},
  created (){
    EventBus.$on('newgraphrequest', (doilist) => {
      this.state = 'building';
      this.doilist = doilist;
    });
    EventBus.$on('graphfinished', (graph) => {
      this.state = 'view';
      this.graph = graph;
    });

  },
});
</script>

<style>

body {
  font-family: monospace;
}

.debug {
  color: #777;
  font-family: serif;
  font-size: 85%;
  font-style: italic;
}
</style>
