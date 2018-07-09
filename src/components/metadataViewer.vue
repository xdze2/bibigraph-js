<template>
  <div class="metadataviewer">
    <h2>metadata</h2>


    <div v-if="metadata">
      {{metadata.DOI}}
      <h3>{{metadata.title[0]}}</h3>

    <ul v-if="metadata.reference">
    </ul>
      <li v-for="ref in metadata.reference">{{ref}}</li>
    </div>
    <p v-else >
      No metadata for {{doi}}.
    </p>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as store from '../modules/bibistore';

import { EventBus } from '../main';

export default Vue.extend({
  name: 'metadataviewer',
  props: ['doi'],
  data(){return {
    //metadata: undefined,
  }},
  computed: {
    metadata(){
      return store.get( this.doi );
    },
  },
  methods: {

  },
});



</script>


<style>


</style>
