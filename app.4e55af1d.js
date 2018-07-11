(function(e){function t(t){for(var r,i,s=t[0],c=t[1],u=t[2],d=0,f=[];d<s.length;d++)i=s[d],a[i]&&f.push(a[i][0]),a[i]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);l&&l(t);while(f.length)f.shift()();return o.push.apply(o,u||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],r=!0,s=1;s<n.length;s++){var c=n[s];0!==a[c]&&(r=!1)}r&&(o.splice(t--,1),e=i(i.s=n[0]))}return e}var r={},a={1:0},o=[];function i(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=r,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],c=s.push.bind(s);s.push=t,s=s.slice();for(var u=0;u<s.length;u++)t(s[u]);var l=c;o.push([5,0]),n()})({5:function(e,t,n){e.exports=n("zUnb")},EDI0:function(e,t,n){},PvK2:function(e,t,n){},"S/S/":function(e,t,n){},ZL7j:function(e,t,n){"use strict";var r=n("EDI0"),a=n.n(r);a.a},aQTq:function(e,t,n){"use strict";var r=n("ro8x"),a=n.n(r);a.a},ctDZ:function(e,t,n){},hA1Z:function(e,t,n){"use strict";var r=n("PvK2"),a=n.n(r);a.a},oZqq:function(e,t,n){"use strict";var r=n("S/S/"),a=n.n(r);a.a},"qK+J":function(e,t,n){"use strict";var r=n("ctDZ"),a=n.n(r);a.a},ro8x:function(e,t,n){},zUnb:function(e,t,n){"use strict";n.r(t);n("VRzm");var r=n("Kw5r"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("div",{staticClass:"header"},[n("h1",[e._v("bibigraph")]),n("span",{staticClass:"debug"},[e._v("state: "+e._s(e.state))]),"view"==e.state?n("a",{attrs:{href:"#"},on:{click:function(t){e.state="request"}}},[e._v("[new graph]")]):e.graph?n("a",{attrs:{href:"#"},on:{click:function(t){e.state="view"}}},[e._v("[cancel]")]):e._e()]),n("div",{staticClass:"main"},[["request"].includes(e.state)?n("requestform"):e._e(),"building"==e.state?n("graphbuilder",{attrs:{doilist:e.doilist}}):e._e(),"view"==e.state?n("graphviewer",{attrs:{graph:e.graph}}):e._e()],1)])},o=[],i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"requestform"},[n("p",[e._v("\n  Request a new graph by specifying the doi to start from:"),n("br"),n("textarea",{directives:[{name:"model",rawName:"v-model",value:e.doitext,expression:"doitext"}],attrs:{placeholder:"give a doi list, comma or space separated"},domProps:{value:e.doitext},on:{input:function(t){t.target.composing||(e.doitext=t.target.value)}}}),n("br"),e._v("\n  Explore\n  "),n("select",{directives:[{name:"model",rawName:"v-model",value:e.ngen,expression:"ngen"}],on:{change:function(t){var n=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){var t="_value"in e?e._value:e.value;return t});e.ngen=t.target.multiple?n:n[0]}}},[n("option",{attrs:{disabled:""}},[e._v("1")]),n("option",{attrs:{selected:""}},[e._v("2")]),n("option",{attrs:{disabled:""}},[e._v("3")])]),e._v(" level(s) of references and then build the upward citation graph from the\n  "),n("input",{directives:[{name:"model",rawName:"v-model.number",value:e.ntop,expression:"ntop",modifiers:{number:!0}}],attrs:{type:"number"},domProps:{value:e.ntop},on:{input:function(t){t.target.composing||(e.ntop=e._n(t.target.value))},blur:function(t){e.$forceUpdate()}}}),e._v(" most cited articles.\n\n  "),n("button",{on:{click:function(t){e.submit(e.doitext)}}},[e._v("go")])]),e.doitext?n("p",{staticClass:"parseddoilist"},[e._v("\n  Parsed list: "),e._l(e.doilist,function(t){return n("span",[e._v("["+e._s(t)+"]  ")])})],2):e._e(),n("p",[e._v("\n    Or use an example: "),n("a",{attrs:{href:"#"},on:{click:function(t){e.doitext="10.1103/PhysRevA.62.012306"}}},[e._v("set example 1")]),e._v(",\n    "),n("a",{attrs:{href:"#"},on:{click:function(t){e.doitext="10.1103/PhysRevA.62.012306, PhysRevA.62.012306Cc1R1"}}},[e._v("set example 2")]),e._v(",\n    "),n("a",{attrs:{href:"#"},on:{click:function(t){e.doitext="10.1103/physreva.51.1015, 10.1143/jpsj.43.1262,10.1109/tdei.2009.4784550,10.1038/30156,10.1103/physrevlett.1.275, 10.1080/00107519608217543"}}},[e._v("example 3")])])])},s=[],c=(n("KKXr"),r["a"].extend({name:"requestform",data:function(){return{doitext:"",ngen:2,ntop:5}},computed:{doilist:function(){return this.doitext.split(/[,;\s]/).filter(function(e){return e})}},methods:{submit:function(e){var t=e.split(/[,;\s]/).filter(function(e){return e}),n={doilist:t,ntop:this.ntop};re.$emit("newgraphrequest",n)}},components:{}})),u=c,l=(n("aQTq"),n("KHd+")),d=Object(l["a"])(u,i,s,!1,null,"36d73118",null),f=d.exports,p=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"graphBuilder"},[n("div",{staticClass:"messageboard"},e._l(e.log,function(t){return n("p",[e._v(e._s(t))])}))])},h=[],v=(n("Z2Ku"),n("L9s1"),n("Vd3H"),n("yt8O"),n("RW0V"),n("rGqo"),n("rE2o"),n("ioFf"),n("iv4g")),g=n("xmWZ"),m=n("vDqi"),_=n.n(m),b=function e(t){Object(g["a"])(this,e),this.data=t,this.title=(t["title"]||[""])[0],this.year=t["issued"]["date-parts"][0][0],this.citedbycount=t["is-referenced-by-count"],this.referencescount=t["references-count"],this.url=t["URL"],this.doi=t["DOI"],this.journal=t["container-title"][0]||"",t["reference"]?(this.referenceWithDOI=t["reference"].filter(function(e){return e["DOI"]}).map(function(e){return e["DOI"]}),this.reference=t["reference"]):(this.reference=[],this.referenceWithDOI=[]),t["author"]?(this.authors=t["author"].map(function(e){return"".concat(e["given"]||""," ").concat(e["family"])}),this.key="".concat(t["author"][0]["family"]).concat(this.year)):(this.authors=[],this.key=this.doi)},y={},w="doi_";function x(e){var t=e.trim().toLowerCase();return"".concat(w).concat(t)}function O(e){return y[x(e)]}function j(e){function t(e,t){var n=O(t);return n?e.present.push(n):e.missing.push(t),e}var n=e.reduce(t,{missing:[],present:[]}),r=n.missing,a=n.present;function o(e){return e.forEach(function(e){y[x(e.doi)]=e}),a.push.apply(a,Object(v["a"])(e)),a}return C(r).then(o)}var k="https://github.com/xdze2",q=16,E="https://api.crossref.org/works";function C(e){e=e.map(function(e){return e.trim()});var t=/^10.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i,n=e.filter(function(e){return!t.test(e)});if(n.length&&console.log("pattern rejected doi:",n),e=e.filter(function(e){return t.test(e)}),0==e.length)return Promise.resolve([]);for(var r=e.length,a=[],o=0;o<r;o+=q){var i=e.slice(o,o+q);i.length>0&&a.push(i)}var s=a.map(function(e){console.log("📡  ".concat(e.length," doi requested"));var t=e.map(function(e){return"doi:".concat(e)}).join(","),n=_.a.get(E,{params:{filter:t,mailto:k,rows:q}});return n}),c=Promise.all(s).then(function(e){var t=[],n=!0,r=!1,a=void 0;try{for(var o,i=e[Symbol.iterator]();!(n=(o=i.next()).done);n=!0){var s=o.value;if(200===s.status){var c=s.data.message.items;t.push.apply(t,Object(v["a"])(c))}else console.log("response error",s)}}catch(e){r=!0,a=e}finally{try{n||null==i.return||i.return()}finally{if(r)throw a}}return t.map(function(e){return new b(e)})});return c}function P(e){console.log("🏗 Start a new graph with ".concat(e.length," node(s)"));var t={};return e.forEach(function(e){e=e.toLowerCase().trim(),t[e]={gen:0,citedby:[]}}),t}function D(e){function t(t,n){return Math.max(t,e[n].gen)}var n=Object.keys(e);return n.reduce(t,0)}function L(e){var t=D(e),n=Object.keys(e),r=n.filter(function(n){return e[n].gen==t});console.log("🚲 Expand generation #".concat(t,", ").concat(r.length," sub-nodes."));var a=j(r).then(function(n){return n.forEach(function(n){var r=n.doi.toLowerCase(),a=n.referenceWithDOI;a?a.forEach(function(n){n=n.trim().toLowerCase(),e[n]?e[n].citedby.push(r):e[n]={gen:t+1,citedby:[r]}}):console.log("🙁  no ref provided for ".concat(r))}),e});return a}function S(e,t){var n=Object.keys(e);return n.sort(function(t,n){return e[n].citedby.length-e[t].citedby.length}),n.slice(0,t)}function Z(e,t){console.log("🚀 building the upward graph");var n,r=[],a=[],o=t;while(n=o.pop())r.push(n),e[n].citedby.forEach(function(e){a.push([n,e]),o.includes(e)||r.includes(e)||o.push(e)});return{nodes:r,links:a}}var $=r["a"].extend({name:"graphBuilder",props:["doilist"],created:function(){this.buildGraph(this.doilist)},data:function(){return{log:["🏭  hello"],graph:void 0}},computed:{},methods:{pushLog:function(e){this.log.push(e)},buildGraph:function(e){var t=this;this.pushLog("Start a new graph..."),this.pushLog("from ".concat(e.doilist.length," selected nodes, for 2 gen"));var n=P(e.doilist);L(n).then(function(e){return L(e)}).then(function(n){var r=S(n,e.ntop);console.log("selected nodes: ",r);var a=Z(n,r);console.log("upward graph: ",a),t.pushLog("upward graph build"),t.pushLog("done"),re.$emit("graphfinished",a)})}},components:{}}),I=$,A=(n("qK+J"),Object(l["a"])(I,p,h,!1,null,"2ca4def5",null)),K=A.exports,R=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"graphviewer"},[n("div",{staticClass:"graphpanel"},[n("svg",{attrs:{id:"svggraph"}})]),n("div",{staticClass:"rightpanel"},[e.selectednode?n("a",{attrs:{href:"#"},on:{click:function(t){e.selectednode=null}}},[e._v("hide metadata")]):e._e(),e.selectednode?n("metadataviewer",{attrs:{doi:e.selectednode}}):e._e()],1)])},N=[],W=(n("xfY5"),n("pIFo"),function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"metadataviewer"},[n("h2",[e._v("metadata")]),e.metadata?n("div",[e._v("\n    "+e._s(e.metadata.doi)+" - "+e._s(e.metadata.key)+"\n    "),n("h3",[e._v(e._s(e.metadata.title))]),n("p",e._l(e.metadata.authors,function(t){return n("span",[e._v(e._s(t)+", ")])})),e._v("\n  ("+e._s(e.metadata.year)+") "+e._s(e.metadata.journal)+" "),n("a",{attrs:{href:e.metadata.url}},[e._v("link")]),n("p",[n("b",[e._v(e._s(e.metadata.citedbycount))]),e._v(" citations "),n("br"),e._v("\n    "+e._s(e.metadata.referencescount)+" references ("+e._s(e.metadata.referenceWithDOI.length)+" with a doi) "),n("br")]),e.metadata.reference?n("ul"):e._e(),e._l(e.metadata.reference,function(t){return n("li",[e._v(e._s(t))])})],2):n("p",[e._v("\n    No metadata for "+e._s(e.doi)+".\n  ")])])}),G=[],V=r["a"].extend({name:"metadataViewer",props:["doi"],data:function(){return{}},computed:{metadata:function(){return O(this.doi)}},methods:{}}),z=V,M=(n("hA1Z"),Object(l["a"])(z,W,G,!1,null,null,null)),T=M.exports,U=n("VphZ"),J=n("EiaH"),B=n.n(J),F=r["a"].extend({name:"GraphViewer",props:["graph"],data:function(){return{selectednode:null}},mounted:function(){this.rendergraph(this.graph)},beforeUpdate:function(){},methods:{rendergraph:function(e){var t=this;console.log(" Do you see a graph? 🦆 "),console.log(e);var n=(new B.a.graphlib.Graph).setGraph({rankdir:"LR"});e.nodes.forEach(function(e){var t=O(e),r=[];0==t.referenceWithDOI.length&&r.push("norefprovided"),n.setNode(e,{label:t.key,id:"doi"+e.replace(/[\./]/g,""),class:r.join(" ")})}),e.links.forEach(function(e){n.setEdge(e[0],e[1],{})});var r=new B.a.render,a=U["b"]("svg"),o=a.append("g"),i=U["b"]("svg>g");i.length=1,r(i,n);var s=(Number(a.attr("width"))-n.graph().width)/2;o.attr("transform","translate("+s+", 20)");var c=U["c"]().on("zoom",function(){o.attr("transform",U["a"].transform)});a.call(c),c.scaleExtent([.2,3]);var u=.75,l=Number(a.attr("width"));a.call(c.transform,U["d"].translate((l-n.graph().width*u)/2,20).scale(u)),a.selectAll("g.node").on("click",function(e){n.node(e);t.selectednode=e,a.selectAll(".node rect").style("fill","white"),a.selectAll("#doi"+e.replace(/[\./]/g,"")+" rect").style("fill","#F44")})}},components:{metadataviewer:T}}),H=F,Q=(n("oZqq"),Object(l["a"])(H,R,N,!1,null,null,null)),X=Q.exports,Y=r["a"].extend({name:"home",components:{requestform:f,graphbuilder:K,graphviewer:X},data:function(){return{state:"request",graph:void 0}},created:function(){var e=this;re.$on("newgraphrequest",function(t){e.state="building",e.doilist=t}),re.$on("graphfinished",function(t){e.state="view",e.graph=t})}}),ee=Y,te=(n("ZL7j"),Object(l["a"])(ee,a,o,!1,null,null,null)),ne=te.exports;n.d(t,"EventBus",function(){return re}),r["a"].config.productionTip=!1;var re=new r["a"];new r["a"]({render:function(e){return e(ne)}}).$mount("#app")}});
//# sourceMappingURL=app.4e55af1d.js.map