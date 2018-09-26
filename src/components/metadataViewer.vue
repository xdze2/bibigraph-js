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
    <a v-bind:href="metadata.url" target="_blank" class='doilink'>{{metadata.doi}}</a>

    <h4>Actions</h4>
    <div class='actionsection'>
      <a v-if="isInGraph" href="#" v-on:click="removeFromGraph(doi)" class='action'>remove from graph</a>
      <a v-else href="#" v-on:click="addToGraph(doi)" class='action'>add to graph</a>
      <br />

    </div>
    <h4>Citations</h4>
    <ul v-if="citedby">
      <li v-for="ref in citedby">
          <!-- <span v-if="ref.ingraph">{{`\u{2714}`}} {{ref.key}} </span>
          <span v-else>- {{ref.key}}</span> -->
      </li>
    </ul>

<!-- <p><b>{{metadata.citedbycount}}</b> citations ({{node.citedby.length}} in the graph,
{{metadata.citedby.length}} known)</p> -->

    <h4>References</h4>
    <a href="#" v-if="hasMissingRefs" v-on:click="queryMissingRefs()" class='action'>search the missing refs.</a>
    <table v-if="reference" cellpadding="0" cellspacing="0">

      <tr v-for="(ref, index) in reference">
        <td class='refnumber'>{{index+1}}.</td>
        <template v-if="ref.ingraph">
          <td class='refkey'>{{ref.key}}</td>
          <td>{{ref.citedbycount}}</td>
          <td>
            <a href="#" v-on:click="showmetadata(ref.doi)" class='action'>view</a>
            <a href="#" v-on:click="removeFromGraph(ref.doi)" class='action'>remove</a>
          </td>
        </template>
        <template v-else-if="ref.instore">
          <td>{{ref.key}}</td>
          <td>{{ref.citedbycount}}</td>
          <td>
            <a href="#" v-on:click="showmetadata(ref.doi)" class='action'>view</a>
            <a href="#" v-on:click="addToGraph(ref.doi)" class='action'>add</a>
          </td>
        </template>
        <template v-else-if="ref.doi">
          <td colspan="3" class='ref-missing'>{{ref.doi}}</td>
        </template>
        <template v-else>
          <td colspan="3" class='ref-nodoi'>-</td>
        </template>
        <!-- <td v-else-if="ref.instore" class='ref-instore'> -->
        <!-- <span v-if="ref.ingraph" class='ref-ingraph'>

        </span>
        <span v-else-if="ref.instore" class='ref-instore'>
          {{ref.key}}
        </span>
        <span v-else-if="ref.doi" class='ref-missing'>
          {{ref.doi}}
        </span>
        <span v-else class='ref-nodoi'>
           -
        </span> -->
      </tr>

    </table>

<p>{{metadata.referencescount}} references, {{metadata.referenceWithDOI.length}} with a doi.</p>


    </div>
    <div v-else >
      No metadata for {{doi}}. <p><a href=''>Look on crossref</a></p>
    </div>


  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import _ from 'lodash';
import * as bibistore from '../modules/bibistore';

import { EventBus, graph} from '../main';

export default Vue.extend({
  name: 'metadataViewer',
  props: ['doi'],
  data(){ return {
    nodelist: graph.state.nodelist,
    graph: {nodes:[], links:[]},
    metadata: {},
  }},
  computed: {
    isInGraph(){
      return  _.includes(this.nodelist, this.doi)
    },
    reference(){
      if( !this.metadata.reference ){
        return null;
      } else {
        return this.parseRefField( this.metadata.reference )
      }
    },
    hasMissingRefs(){
      return this.reference.some( (parsedref) => !parsedref.instore );
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
    this.metadata = bibistore.get( [this.doi] )[0];
  },
  beforeUpdate (){
    this.metadata = bibistore.get( [this.doi] )[0];
  },
  methods: {
    parseRefField( reflist ){
      /* Analyse the reference information provided by CrossRef */

      const doilist = reflist.filter( (refinfo) => refinfo.DOI )
                             .map( (refinfo) => refinfo.DOI )

      const parsedreflist = doilist.map( (doi) => {
        const metadata = bibistore.get([doi])[0];
        const key = metadata? metadata.key : doi;

        return {
          doi: doi,
          key: key,
          instore: !!metadata,
          ingraph: this.isDoiInGraph(doi),
          citedbycount: metadata? metadata.citedbycount : '#',
        }
      })
      return parsedreflist
    },
    isDoiInGraph(doi){
      return this.nodelist.filter( (nodedoi) => nodedoi.toLowerCase() === doi.toLowerCase() ).length == 1
    },
    addToGraph(doi){ graph.addToGraph(doi);  },
    removeFromGraph(doi){ graph.removeFromGraph(doi); },
    closepanel(){
      EventBus.$emit('closemetadata')
    },
    showmetadata (doi){
      EventBus.$emit('showmetadata', doi);
    },
    queryMissingRefs(){

      var doi_refs = this.metadata.referenceWithDOI
      doi_refs = doi_refs.filter( (doi) => !bibistore.get([doi])[0] )

      // query missing
      bibistore.query(doi_refs).then( (metadata) => {
        //this.alldoi = bibistore.alldoi();
        console.log('refs added')
        this.metadata =  Object.assign({}, bibistore.get( [this.doi] )[0]);
        EventBus.$emit('storageUpdate')
      })
    },
  },
});



</script>


<style scoped>
.metadataviewer {
  padding: 3px;
}
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
  text-shadow: 2px 2px 2px #aaa;
}
h4 + * {
  margin-top: .1em;
}
table {
  width: 100%;
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

.ref-missing {
  color: #444;
  font-size: 90%;
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

.doilink {
  text-decoration: none;
  color: blue;
}
.doilink:hover {
  text-decoration: underline;
}

tr:hover {
  background-color: #eee;
}
td.refnumber {
  text-align: right;
  width: 2em;
  padding-right: .4em;
  font-size: 95%;
}

a.action {
  text-decoration: none;
  color: blue;
}
.action::after {
  content: ' ';
}
a.action:hover{
  color: red;
}
</style>
