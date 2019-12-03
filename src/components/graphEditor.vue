<template>
<div class="graphEditor" >

<h3 title="nodes in the graph">node list</h3>
<p v-if='selectedNodes.length>0'>{{selectedNodes.length}} selected:
  <a href='#' v-on:click="removeFromGraph(selectedNodes); selectedNodes=[]; selectall=false;">remove</a>,
  <a href='#' v-on:click="searchRefsOf(selectedNodes);">search missing refs.</a>,
  add refs. to the graph
</p>
<table v-if='graphmetadata.length'>
<tr>
  <th><input type="checkbox" id="selectall" v-model="selectall"></th>
  <th>key</th>
  <th>year</th>
  <th style='text-align:right;'>citations</th>
  <th>(known)</th>
  <th>[in graph]</th>
  <th>refs.</th>
  <th>(doi)</th>
  <th>[in graph]</th>
  <th>actions</th>
</tr>
<tr v-for="metadata in graphmetadata">
  <td class='selectbox'><input type="checkbox" v-model="selectedNodes"
    v-bind:id="metadata.doi"  v-bind:value="metadata.doi"></td>
  <td><a href="#" v-on:click="showmetadata(metadata.doi)">{{metadata.key}}</a></td>
  <td>{{metadata.year}}</td>
  <!-- cited by -->
  <td style='text-align:right;'>{{metadata.citedbycount}}</td>
  <td>({{metadata.citedby.length}})
    <a href='#' v-if="nbrInGraph(metadata.citedby) < metadata.citedby.length"
       v-on:click="addToGraph(metadata.citedby)">add</a>
  </td>
  <td>{{nbrInGraph(metadata.citedby)}}
  </td>
  <!-- references -->
  <td>{{metadata.referencescount}}</td>
  <td> {{metadata.referenceWithDOI.length}}
    <a href="#" v-if="metadata.referenceWithDOI.length&&hasUnknownRefs(metadata.referenceWithDOI)"
        v-on:click="searchRefsOf([metadata.doi])">search</a>
    <span v-else-if="!metadata.referenceWithDOI.length">:/</span>
    <a href='#' v-else-if="nbrInGraph(metadata.referenceWithDOI) < metadata.referenceWithDOI.length"
       v-on:click="addToGraph(metadata.referenceWithDOI)">add</a>
    <span v-else>&#10003;</span>
  </td>
  <td>
    ({{nbrInGraph(metadata.referenceWithDOI)}})
    <a href='#' v-if="nbrInGraph(metadata.referenceWithDOI)"
       v-on:click="removeFromGraph(metadata.referenceWithDOI)">remove</a>
  </td>
  <!-- action -->
  <td>
    <a href='#' v-on:click="removeFromGraph([metadata.doi])">remove </a>
  </td>
</tr>
</table>
<p v-else> no node </a>



<h3 title="all nodes known">store</h3>
<p class='storelist'>
  <span v-for="doi in alldoi" class='store_chip'>
  <a href="#" v-on:click="showmetadata(doi)" title="🖰 show metadata">{{doi | key}}</a>
  <a href='#' v-if="!isInNodelist(doi)" v-on:click="addToGraph([doi])" title="🖰 add to the graph">[add]</a>
  </span>
</p>

<h3>add to store</h3>
<form>
<textarea v-model="doitext" placeholder="give a doi list, comma or space separated"  :disabled="waiting" ></textarea>
<button v-on:click="submit(doitext)" :disabled="waiting">go</button>
</form>
<p>
  Or use an example: <a href='#' v-on:click="doitext='10.1103/PhysRevA.62.012306'">set example 1</a>,
  <a href='#' v-on:click="doitext='10.1103/PhysRevA.62.012306, PhysRevA.62.012306Cc1R1'">set example 2</a>,
  <a href='#' v-on:click="doitext='10.1103/physreva.51.1015, 10.1143/jpsj.43.1262,10.1109/tdei.2009.4784550,10.1038/30156,10.1103/physrevlett.1.275, 10.1080/00107519608217543'">example 3</a>
</p>
<p>
{{doilist}}
</p>
<span v-if="waiting">wait...</span>


</div>
</template>

<script lang="ts">
import Vue from 'vue';
import {EventBus, graph} from '../main';
import * as bibistore from '../modules/bibistore';
import {addLinks} from '../modules/graphbuilder';
import _ from 'lodash';



//import * as graphbuildingmachine from '../modules/graphbuilder';

export default Vue.extend({
  name: 'graphEditor',
  props: [],
  created (){
      //this.buildGraph(this.graphspec);
      this.alldoi = bibistore.alldoi();

      EventBus.$on('storageUpdate', () => {
        console.log('event in graph ed, storage')
        this.$forceUpdate();
        this.alldoi = bibistore.alldoi();
      });
  },
  data (){ return {
      doitext: '',
      data: undefined,
      waiting:false,
      alldoi: undefined,
      nodelist: graph.state.nodelist,
      links: graph.state.links,
      selectedNodes: [],
      selectall: false,
  }; },
  computed: {
      doilist (){ return this.parse_doitext(this.doitext) },
      graphmetadata (){ return bibistore.get(this.nodelist) }
      //allmetadata (){ return bibistore.get(this.alldoi) },
  },
  watch: {
    // whenever question changes, this function will run
    selectall: function (newValue, oldValue) {
      this.selectedNodes = newValue? this.nodelist.slice(0): [];
    },
  },
  filters: {
    key (doi){
      return bibistore.get([doi])[0].key
    }
  },
  methods: {
    submit(doitext: string) {
      const doilist = this.parse_doitext(doitext);

      this.waiting = true;
      this.doitext = '';
      bibistore.query(doilist).then((data)=>{

        this.waiting = false;
        //this.data = data;
        this.alldoi = bibistore.alldoi();
      })

    },
    parse_doitext(doitext: string): string[]{
      return this.doitext.split(/[,;\s]/).filter( (x) => x )
    },
    addToGraph(doilist){ graph.addToGraph(doilist); },
    removeFromGraph(doilist){ graph.removeFromGraph(doilist); },
    isInNodelist(doi){
      const match = this.nodelist.filter( (nodedoi) => nodedoi == doi )
      return match.length > 0
    },
    searchRefsOf(doilist){
      const metadata = bibistore.get(doilist)
      var refs = metadata.map( (md) => md.referenceWithDOI )
      refs =  [].concat(...refs)

      // query missing
      bibistore.query(refs).then( (metadata) => {
        this.alldoi = bibistore.alldoi();
      })
    },
    showmetadata (doi){
      EventBus.$emit('showmetadata', doi);
    },
    hasUnknownRefs(missingreflist){
      missingreflist = bibistore.get(missingreflist)
                          .filter( (metadata) => !metadata)
      return missingreflist.length
    },
    nbrInGraph(doilist){
      return doilist.filter( (doi) => _.includes(this.nodelist, doi.toLowerCase()) )
                    .length
    }
  },
  components: {
  }
});
</script>


<style scoped>
.graphEditor {
  padding:30px;
  padding-top:3px;

}

table {
  max-width: 900px;
}
th {
  text-align: left;
}
tr, td {
  padding: 0;
  margin: 0;
}

a {
  text-decoration: none;
  color: blue;
}
a:hover {
  color:red;
}
textarea {
  width: 20em;
  height: 6em;
}
p.storelist {
  width: 87%;
  /* border: solid 2px red; */
  text-align: left;

}
.store_chip {
  padding: 1px;
  margin: 0 2px 0 2px;
}
.store_chip a {
  text-decoration: none;
  color: black;
}
.store_chip a:hover {
  color: red;
}
.store_chip:hover {
  background-color: #eee;
}
.store_chip::after {
  content: ' ';
}

</style>
