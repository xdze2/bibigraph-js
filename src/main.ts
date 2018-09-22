import Vue from 'vue';
import App from './App.vue';
import * as bibistore from './modules/bibistore';
import _ from 'lodash';

Vue.config.productionTip = false;


export const EventBus = new Vue();

// https://medium.com/fullstackio/managing-state-in-vue-js-23a0352b1c87
export const Graph = {
  nodelist: [],
  isInNodelist(doi){
    const match = this.nodelist.filter( (metadata) => metadata.doi == doi )
    return match.length > 0
  },
  addToGraph(doi){
    if(!_.includes(this.nodelist, doi)){
      this.nodelist.push(doi)
    }
  },
  removeFromGraph(doi){
    this.nodelist.splice(this.nodelist.indexOf(doi), 1)
  },
};



new Vue({
  render: (h) => h(App),
}).$mount('#app');
