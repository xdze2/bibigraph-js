<template>
<div id="app">

<div class="header">
  <h1>bibigraph</h1>
  <!-- <span class='debug'>state: {{state}}</span> -->
  <a href="javascript:" v-if="state=='view'" v-on:click="state='request'" class='navlink'>edit</a>
  <a href="javascript:" v-else-if="graph" v-on:click="state='view'" class='navlink'>←</a>

  <!-- <a href="#" class='navlink'>about</a> -->
</div>
<div class="main">
  <requestform v-if="['request'].includes(state)" v-bind:spec="graphspec"></requestform>
  <graphbuilder v-if="state=='building'" v-bind:graphspec="graphspec"></graphbuilder>

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
    graph: null,
    graphspec: null,
  }},
  created (){
    EventBus.$on('newgraphrequest', (graphspec) => {
      this.state = 'building';
      this.graphspec = graphspec;
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
  font-size: 20px;
  margin-right: 30px;
  color: #252525;
  text-shadow: 2px 2px 0px #ddd;
  font-family: monospace;
}

.navlink {
  display: inline-block;
  font-weight:bolder;
  text-decoration: none;
  font-size: 16px;

  padding: 3px;
  padding-left: 7px;
  padding-right: 7px;
  margin: 1px;
  color: #fff;
  letter-spacing: 1px;
  text-shadow: -1px 0 #6b6B6b, 0 1px #6b6B6b, 1px 0 #6b6B6b, 0 -1px #6b6B6b, 2px 2px 3px #fff; ;
  transition: transform .7s ease, text-shadow 0.6s ease;
}
.navlink:hover {
  text-shadow:  -1px 0 #6b6B6b, 0 1px #6b6B6b, 1px 0 #6b6B6b, 0 -1px #6b6B6b, 2px 2px 3px #444;
  transform: translate(-1px, -1px);
}
.navlink:active {
  text-shadow:  -1px 0 #6b6B6b, 0 1px #6b6B6b, 1px 0 #6b6B6b, 0 -1px #6b6B6b, 2px 2px 3px #fff;
  transform: translate(0px, 0px);
  transition: transform .2s ease, text-shadow 0.2s ease;
  /* color: red; */
}

</style>
