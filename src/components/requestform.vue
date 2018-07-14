<template>
<div class="requestform" >

  <p>
  Request a new graph by specifying the doi to start from:<br />
  <textarea v-model="doitext" placeholder="give a doi list, comma or space separated"></textarea>
  <br />
  Explore
  <select v-model="ngen">
    <option disabled>1</option>
    <option selected>2</option>
    <option disabled>3</option>
  </select> level(s) of references and then build the upward citation graph from the
  <input v-model.number="ntop" type="number"> most cited articles.

  <button v-on:click="submit(doitext)">go</button>
  </p>
  <p class='parseddoilist' v-if="doitext">
  <span v-for="entry in analyseddoilist" v-bind:class="{'instore':entry.instore ,'notvaliddoi':entry.notvalid}">[{{ entry.key }}]  </span>
  </p>

  <p>
    Or use an example: <a href='#' v-on:click="doitext='10.1103/PhysRevA.62.012306'">set example 1</a>,
    <a href='#' v-on:click="doitext='10.1103/PhysRevA.62.012306, PhysRevA.62.012306Cc1R1'">set example 2</a>,
    <a href='#' v-on:click="doitext='10.1103/physreva.51.1015, 10.1143/jpsj.43.1262,10.1109/tdei.2009.4784550,10.1038/30156,10.1103/physrevlett.1.275, 10.1080/00107519608217543'">example 3</a>
  </p>

</div>
</template>

<script lang="ts">

import Vue from 'vue';
import { EventBus } from '../main';
import * as graphbuilder from '../modules/graphbuilder';
import graphviewer from '@/components/GraphViewer.vue';
import * as bibistore from '../modules/bibistore';

export default Vue.extend({
  name: 'requestform',
  props: ['spec'],
  data: () => { return {
      doitext: '',
      ngen: 2,
      ntop: 5,
  }; },
  computed: {
    doilist (){ return this.doitext.split(/[,;\s]/).filter( (x) => x ) },
    analyseddoilist(){
      return this.doilist.map( (doi) => {
        const metadata = bibistore.get(doi);
        return {
          key: (metadata ? metadata.key : doi),
          instore: (metadata ? true : false),
          notvalid: !bibistore.isValidDOI(doi),
        }
      })
    },
  },
  methods: {
    submit(doitext: string) {
      const doilist = doitext.split(/[,;\s]/).filter( (x) => x );
      const graphspec = {
        doilist:doilist,
        ntop:this.ntop,
        ngen:this.ngen,
      }
      EventBus.$emit('newgraphrequest', graphspec);
    },
  },
  components: {
  },
  created(){
    if(this.spec != null){
      this.doitext = this.spec.doilist.join(', ')
      this.ntop = this.spec.ntop
      this.ngen = this.spec.ngen
    }
  },
});
</script>


<style scoped>

textarea {
  width: 50em;
  height: 9em;
  padding: 5px;
  margin:4px;
  font-size: 110%;
  /* box-shadow: inset 1px 2px 3px #ddd; */
}


.parseddoilist{
  color: #777;
}
.parseddoilist .notvaliddoi {
  color: red;
  text-decoration: line-through;
}
.parseddoilist .instore {
  color: magenta;
}

.requestform {
  padding: 5px;
  padding-left: 2em;
}
</style>
