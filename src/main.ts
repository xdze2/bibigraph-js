import Vue from 'vue';
import App from './App.vue';
import * as bibistore from './modules/bibistore';
import _ from 'lodash';

import * as builder from './modules/graphbuilder';
import {graphreduce} from './modules/transitiveReduction';

Vue.config.productionTip = false;


export const EventBus = new Vue();

// https://medium.com/fullstackio/managing-state-in-vue-js-23a0352b1c87
export const graph = {
  state: {
    nodelist: [],
    links: [],
    secondary: [],
  },
  isInNodelist(doi){
    const match = this.state.nodelist.filter( (metadata) => metadata.doi == doi )
    return match.length > 0
  },
  addToGraph(doilist){
    doilist.forEach( (doi) => {
           doi = doi.toLowerCase()
           if( this.state.nodelist.indexOf(doi) == -1 ){
             this.state.nodelist.push(doi)
           }
          });
    // this.updateLinks();
  },
  removeFromGraph(doilist){
    for (let i = 0; i < doilist.length; i++) {
      const doi = doilist[i]
      const idx = this.state.nodelist.indexOf(doi.toLowerCase())
      if( idx > -1 ){ this.state.nodelist.splice(idx, 1);  }
    }
    // this.updateLinks();
  },
};



new Vue({
  render: (h) => h(App),
}).$mount('#app');
