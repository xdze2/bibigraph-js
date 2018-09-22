<template>
  <div class="metadataviewer">
    <a class='close' href="#" v-on:click="closepanel()">close[x]</a>

    <div v-if="metadata">
      <span class='refnumber'>{{metadata.key}}</span>

      <h3>{{metadata.title}}</h3>


      <p>
      <span v-for="auth of metadata.authors" class='author'>{{auth}}, </span>
      </p>
    {{metadata.year}} - {{metadata.journal}} <br />
    <a v-bind:href="metadata.url" target="_blank">{{metadata.doi}}</a>

    <h4>Citations:</h4>
    <ul v-if="citedby">
      <li v-for="ref in citedby">
          <!-- <span v-if="ref.ingraph">{{`\u{2714}`}} {{ref.key}} </span>
          <span v-else>- {{ref.key}}</span> -->
      </li>




    </ul>

<!-- <p><b>{{metadata.citedbycount}}</b> citations ({{node.citedby.length}} in the graph,
{{metadata.citedby.length}} known)</p> -->

    <h4>References:</h4>
    <ol v-if="reference">

      <li v-for="ref in reference">
        <span v-if="ref.ingraph" class='ref-ingraph'>
          {{ref.key}}
        </span>
        <span v-else-if="ref.instore" class='ref-instore'>
          {{ref.key}}
        </span>
        <span v-else-if="ref.doi" class='ref-missing'>
          {{ref.doi}}
        </span>
        <span v-else class='ref-nodoi'>
           -
        </span>
      </li>

    </ol>

<p>{{metadata.referencescount}} references, {{metadata.referenceWithDOI.length}} with a doi.</p>

    </div>
    <div v-else >
      No metadata for {{doi}}. <p><a href=''>Look on crossref</a></p>


    </div>
    <h4>actions</h4>
    <a v-if="isInGraph" href="#" v-on:click="removeFromGraph(doi)" >remove from graph</a>
    <a v-else href="#" v-on:click="addToGraph(doi)" >add to graph</a>

  </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import _ from 'lodash';
import * as bibistore from '../modules/bibistore';

import { EventBus, Graph} from '../main';

export default Vue.extend({
  name: 'metadataViewer',
  props: ['doi'],
  data(){ return {
    nodelist: Graph.nodelist,
    graph: {nodes:[], links:[]},
  }},
  computed: {
    isInGraph(){
      return  _.includes(this.nodelist, this.doi)
    },
    metadata(){
      return bibistore.get( [this.doi] )[0];
    },
    reference(){
      if( !this.metadata.reference ){
        return null;
      } else {
        return this.metadata.reference.map( this.parseRefField )
      }
      return 'ref'
    },
    // node(){
    //   return this.graph.nodes.filter( (node) => node.doi.toLowerCase() === this.doi.toLowerCase() )[0]
    // },
    citedby(){
      return this.metadata.citedby.map( (doi)=> ({
        key: bibistore.get([doi])[0].key,
        doi: doi,
        ingraph: this.isDoiInGraph(doi),
      }))
    },
  },
  created (){
    console.log('hello meta', this.doi)
  },
  methods: {
    parseRefField(ref){
      /* Analyse the reference information provided by CrossRef */
      if(ref.DOI){
        const metadata = bibistore.get([ref.DOI])[0];
        const key = metadata? metadata.key : ref.DOI;

        return {
          doi: ref.DOI,
          key: key,
          instore: !!metadata,
          ingraph: this.isDoiInGraph(ref.DOI),
        }
      } else { // missing
        return ref
      }
    },
    isDoiInGraph(doi){
      return this.nodelist.filter( (nodedoi) => nodedoi.toLowerCase() === doi.toLowerCase() ).length == 1
    },
    addToGraph(doi){ Graph.addToGraph(doi);  },
    removeFromGraph(doi){ Graph.removeFromGraph(doi); },
    closepanel(){
      EventBus.$emit('closemetadata')
    },
  },
});



</script>


<style>

h3 {
  margin: 0;
  padding: 0;
  font-family: serif;
  font-weight: bold;
  font-size: 95%;
  width: 98%;
  display: block;
  margin-top: 3px;
}
h4 {
  margin-bottom: 0;
  padding-bottom: 0;
  font-weight: normal;
  font-size: 115%;
}
h4 + * {
  margin-top: .1em;
}
ul, ol, li {
  list-style: none;
  margin-left: 0;
  padding-left: 0;
}
ol {list-style: none; counter-reset: li}
ol > li::before {
  content: counter(li);
  display: inline-block;
  width: 2em;
  margin-left: -2em;
  color: #888;
  font-size: 75%;
  font-weight: bold;
  text-align: right;
}
ol > li {
  counter-increment: li;
  margin-left: 1em;
}

.refnumber {
  font-style: 105%;
  color: #aaa;
  font-weight: normal;
  font-family: monospace;
}
.ref-missing {
  color: #666;
}
.ref-ingraph {
  color: black;
  font-weight: bold;
}
.ref-instore {
  color: black;
  font-weight: normal;
}
.ref-nodoi {
  color: #666;
}
.author {
  display: inline-block;
  margin-right: 1em;
}
.close {
  float: right;
  display:block;
  margin:3px;
  margin-left:5px;
  text-decoration: none;
  color: black;
  font-weight: normal;
}
.close:hover {
  color: blue;
}
</style>
