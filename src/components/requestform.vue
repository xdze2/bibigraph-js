<template>
  <div class="requestform">

    <h1>hello</h1>

    <textarea v-model="doitext" placeholder="give a doi list, comma or space separated"></textarea>
    <button v-on:click="submit(doitext)">go</button>


{{ doitext }}

<p><button v-on:click="setexample()">set example</button></p>

<p v-if="status">{{ status }}</p>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'requestform',
  data: function(){ return {
      doitext: '',
      status: ''
  }},
  methods: {
    submit: function(doitext){
      console.log('hello', doitext)
      this.status = 'go'
    },
    setexample: function(){
      this.$data.doitext = '10.1103/PhysRevA.62.012306'
    }
  }
});
</script>


<style scoped>

</style>
