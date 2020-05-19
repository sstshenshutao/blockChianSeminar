// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en'
import LLApp from "./js/api/app"
Vue.use(ElementUI,{ locale });
Vue.config.productionTip = false

let loveLockBaseArtifact = require('../public/LoveLockBase.json')
let saleLoveLockArtifact = require('../public/SaleLoveLock.json')
console.log("loveLockBaseArtifact", loveLockBaseArtifact);
console.log("saleLoveLockArtifact", saleLoveLockArtifact);
let llApp = new LLApp({
  abiJSON: {LoveLockBase: loveLockBaseArtifact, SaleLoveLock: saleLoveLockArtifact}
})
Vue.prototype.$llApp = llApp;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
