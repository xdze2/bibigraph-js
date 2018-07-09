<template>
<div id="app">

<div class="header">
  <h1>bibigraph</h1>
  <span class='debug'>state: {{state}}</span>
  <a href="#" v-if="state=='view'" v-on:click="state='request'">[new graph]</a>
  <a href="#" v-else-if="graph" v-on:click="state='view'">[cancel]</a>
</div>
<div class="main">
  <requestform v-if="['request'].includes(state)"></requestform>
  <graphbuilder v-if="state=='building'" v-bind:doilist="doilist"></graphbuilder>

  <graphviewer v-if="state=='view'" v-bind:graph="graph"></graphviewer>
</div>

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
<!-- http://blog.stevensanderson.com/2011/10/05/full-height-app-layouts-a-css-trick-to-make-it-easier/ -->
<style>

body {
  font-family: monospace;
  margin: 0px;
  padding: 0px;
}
#app {
}
.debug {
  color: #777;
  font-family: serif;
  font-size: 85%;
  font-style: italic;
}

.main {
  position: absolute;
  left:0;
  right:0px;
  top:30px;
  bottom:0px;
  padding:0px;
  margin:0px;
  background-color: white;
}
.header {
  position: absolute;
  left:0px;
  right:0;
  top:0px;
  padding:5px;
  height:30px;

}
.header h1 {
  float: left;
  padding:0;
  margin:0px;
  font-size: 18px;
  margin-right: 30px;
  color: #252525;
  text-shadow: 2px 2px 0px #ddd; /*f4f4f4; */
}
</style>
