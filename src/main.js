// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import { router } from './router/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'
import plugin from './plugin/plugin'
import store from './vuex/store'

Vue.use(plugin);
Vue.use(ElementUI);

//axios.defaults.headers.post['Content-type'] = 'application/json';
Vue.prototype.$axios = axios;

Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
