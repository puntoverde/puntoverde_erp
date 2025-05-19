import Vue from 'vue'
import App from './App.vue'
import Storage from 'vue-ls'
import vuetify from '@/plugins/vuetify';
import axios from 'axios'

import '@mdi/font/css/materialdesignicons.css'
  
axios.defaults.baseURL = 'http://192.168.2.111:85/PV2/core/controller';

const instance=axios.create({baseURL:import.meta.env.VITE_APP_LEGAL_API})
Vue.prototype.$axios=instance
Vue.config.productionTip = false

Vue.use(Storage,{namespace:'vuejs__',name:'ls',storage:'session'});


new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')