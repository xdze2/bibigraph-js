<template>
  <div class="metadataviewer">
    <h2>metadata</h2>


    <div v-if="metadata">
      {{metadata.doi}} - {{metadata.key}}
      <h3>{{metadata.title}}</h3>
      <p>
      <span v-for="auth of metadata.authors">{{auth}}, </span>
      </p>
    ({{metadata.year}}) {{metadata.journal}} <a v-bind:href="metadata.url">link</a>

    <p>
      <b>{{metadata.citedbycount}}</b> citations <br />
      {{metadata.referencescount}} references ({{metadata.referenceWithDOI.length}} with a doi) <br />
    </p>

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
  name: 'metadataViewer',
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
