<template>
  <div class="home">
    <requestform />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import requestform from '@/components/requestform.vue';
// @ is an alias to /src

export default Vue.extend({
  name: 'home',
  components: {
    requestform,
  },
});
</script>
