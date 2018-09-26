<template>
<div id="app" class='fullpage'>

<div class="header">
  <h1>bibigraph</h1>

  <a href="javascript:" v-if="mainpanel=='editor'" v-on:click="mainpanel='graph'" class='navlink'>graph</a>
  <a href="javascript:" v-else-if="mainpanel=='graph'" v-on:click="mainpanel='editor'" class='navlink'>edit</a>

  <!-- <span class='debug'>state: {{state}}</span> -->
  <!-- <a href="javascript:" v-if="state=='view'" v-on:click="state='request'" class='navlink'>create</a> -->
  <!-- <a href="javascript:" v-else-if="graph" v-on:click="state='view'" class='navlink'>←</a> -->



  <!-- <input type="checkbox" id="drawSecondary" v-model="drawSecondary"> -->
  <!-- <label for="drawSecondary">secondary links {{ drawSecondary }}</label> -->
  <!-- <a href="#" class='navlink'>about</a> -->
</div>
<div class="main">
  <!-- <requestform v-if="['request'].includes(state)" v-bind:spec="graphspec"></requestform> -->
  <!-- <graphbuilder v-if="state=='building'" v-bind:graphspec="graphspec"></graphbuilder> -->

  <div class='leftpanel'>
    <grapheditor v-if="mainpanel=='editor'" class="grapheditor"></grapheditor>
    <graphviewer v-else-if="mainpanel=='graph'"></graphviewer>
  </div>
  <metadataviewer v-if="selectednode" class="rightpanel" v-bind:doi="selectednode">
  </metadataviewer>

</div>

</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { EventBus, graph } from './main';

//import requestform from '@/components/requestform.vue';
import grapheditor from '@/components/graphEditor.vue';
import metadataviewer from '@/components/metadataViewer.vue';
// import graphbuilder from '@/components/graphBuilder.vue';
import graphviewer from '@/components/graphViewer.vue';
// @ is an alias to /src

// <graphviewer v-if="graph" v-bind:graph="graph" />


export default Vue.extend({
  name: 'home',
  components: {
    // requestform,
    grapheditor,
    metadataviewer,
    graphviewer,
  },
  data(){ return {
    mainpanel: 'editor',
    graph: null,
    graphspec: null,
    drawSecondary: true,
    selectednode: undefined,
    nodelist: graph.state.nodelist,
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
    EventBus.$on('showmetadata', (doi) => {
      this.selectednode = doi;
    });
    EventBus.$on('closemetadata', () => {
      this.selectednode = undefined;
    });

    EventBus.$on('storageUpdate', () => {
      this.$forceUpdate();
    });
  },
});
</script>

<style>
/* https://css-tricks.com/snippets/css/a-guide-to-flexbox/ */
html,
body {
  font-family: monospace;
  margin: 2px;
  padding: 0px;
  height: 100%;
  box-sizing: border-box;
}
.debug {
  color: #777;
  border: solid red 1px;
}
.fullpage {
  display: flex;
  flex-flow: column;
  height: 100%;
  box-sizing: border-box;
}
.header {
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
  height: 30px;
  /* border: solid blue 1px; */
  box-sizing: border-box;
}
.main {
  flex: 1 1 auto;
  /* border: solid magenta 2px; */

  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  padding:0px;
  margin:0px;
  box-sizing: border-box;
  overflow: hidden;
}
.leftpanel {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
  /* border: 3px solid red; */
}
.rightpanel {
  width: 400px;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 400px;
  /* border: solid green 2px; */
  overflow-y: scroll;
}

.header {
  padding: 3px;
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
