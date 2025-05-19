import Vue from 'vue'
import Vuex from 'vuex'
import moduloFactura from './storeModuleFactura'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules:{
       sFactura:moduloFactura
  }
})
