<template>
  <div class="metadataviewer">

    <div v-if="metadata">
      <span class='refnumber'>{{metadata.key}}</span>
      add
      <h3>{{metadata.title}}</h3>


      <p>
      <span v-for="auth of metadata.authors">{{auth}}, </span>
      </p>
    {{metadata.year}} - {{metadata.journal}}
    <a v-bind:href="metadata.url" target="_blank">{{metadata.doi}}</a>

    <p>
      <b>{{metadata.citedbycount}}</b> citations ({{node.citedby.length}} in the graph,
      {{metadata.citedby.length}} known)

      <ul v-if="citedby">

        <li v-for="ref in citedby">
            <span v-if="ref.ingraph">{{`\u{2714}`}}</span> {{ref.key}} {{ref.doi}}
        </li>

      </ul>

    </p>

    <p>
      {{metadata.referencescount}} references ({{metadata.referenceWithDOI.length}} with a doi): <br />


    <ol v-if="reference">

      <li v-for="ref in reference">
        <span v-if="ref.doi">
          {{ref.ingraph ? `\u{2714}`:''}} {{ref.key}}  {{ref.instore ? `\u{1F4BE}`:''}}
        </span>
        <span v-else>
         -- missing
        </span>
      </li>

    </ol>
  </p>
    </div>
    <div v-else >
      No metadata for {{doi}}. <p><a href=''>Look on crossref</a></p>

      {{node}}
    </div>

  </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as bibistore from '../modules/bibistore';

import { EventBus } from '../main';

export default Vue.extend({
  name: 'metadataViewer',
  props: ['doi', 'graph'],
  data(){return {
    //metadata: undefined,
  }},
  computed: {
    metadata(){
      return bibistore.get( this.doi );
    },
    reference(){
      if( !this.metadata.reference ){
        return null;
      } else {
        return this.metadata.reference.map( this.parseRefField )
      }
      return 'ref'
    },
    node(){
      return this.graph.nodes.filter( (node) => node.doi.toLowerCase() === this.doi.toLowerCase() )[0]
    },
    citedby(){
      return this.metadata.citedby.map( (doi)=> ({
        key: bibistore.get(doi).key,
        doi: doi,
        ingraph: this.isInGraph(doi),
      }))
    },
  },
  methods: {
    parseRefField(ref){
      /* Analyse the reference information provided by CrossRef */
      if(ref.DOI){
        const metadata = bibistore.get(ref.DOI);
        const key = metadata? metadata.key : ref.DOI;

        return {
          doi: ref.DOI,
          key: key,
          instore: !!metadata,
          ingraph: this.isInGraph(ref.DOI),
        }
      } else { // missing
        return ref
      }
    },
    isInGraph(doi){
      return !!this.graph.nodes.filter( (node) => node.doi.toLowerCase() === doi.toLowerCase() ).length
    }
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
.refnumber {
  font-style: 105%;
  color: #aaa;
  font-weight: normal;
  font-family: monospace;
}


</style>