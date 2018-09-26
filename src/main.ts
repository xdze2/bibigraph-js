import Vue from 'vue';
import App from './App.vue';
import * as bibistore from './modules/bibistore';
import _ from 'lodash';

import * as builder from './modules/graphbuilder';


Vue.config.productionTip = false;


export const EventBus = new Vue();

// https://medium.com/fullstackio/managing-state-in-vue-js-23a0352b1c87
export const graph = {
  state: {
    nodelist: [],
    links: [],
  },
  isInNodelist(doi){
    const match = this.state.nodelist.filter( (metadata) => metadata.doi == doi )
    return match.length > 0
  },
  addToGraph(doi){
    if(!_.includes(this.state.nodelist, doi)){
      this.state.nodelist.push(doi.toLowerCase())
      this.updateLinks();
    }
  },
  removeFromGraph(doi){
    doi = doi.toLowerCase()
    this.state.nodelist.splice(this.state.nodelist.indexOf(doi), 1)
    this.updateLinks();
  },
  updateLinks(){
    this.state.links.splice(0, this.state.links.length)  // empty the array without loosing ref.
    builder.addLinks(this.state.nodelist).forEach( (link)=>{
      this.state.links.push(link)
    })
    console.log('nbr links:', this.state.links)
  },
};



new Vue({
  render: (h) => h(App),
}).$mount('#app');
