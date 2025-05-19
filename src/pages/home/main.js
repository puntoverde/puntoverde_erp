import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import vuetify from '@/plugins/vuetify';
import axios from 'axios'
import axiosPlugin from '@/plugins/axiosPlugin'
import VeeValidate,{Validator} from 'vee-validate';
import es from 'vee-validate/dist/locale/es'
import Storage from 'vue-ls'
import { mask } from "vue-the-mask";
import { CurrencyDirective} from "vue-currency-input";
import '@mdi/font/scss/materialdesignicons.scss'
import dayjs from'dayjs'
import 'dayjs/locale/es-mx'
import SvgIcon from '@jamescoyle/vue-icon'
import VuetifyConfirm from 'vuetify-confirm'
import VuetifyToast from 'vuetify-toast-snackbar'

import '@/assets/css/global.css'

dayjs.locale('es-mx')

Vue.use(VeeValidate);
Validator.localize('es',es)
  
  axios.defaults.baseURL = 'http://192.168.2.111:85/PV2/core/controller';
// axios.defaults.baseURL = 'http://puntoverdevue.com.mx:8088/core/controller'; 
// axios.defaults.baseURL = '/PV2/core/controller'; 
//axios.defaults.baseURL = 'http://localhost/pv/PV2/core/controller'; 

const instance=axios.create({baseURL:import.meta.env.VITE_APP_LEGAL_API})
Vue.prototype.$axios=instance
Vue.prototype.$axiosFinanzas = axios.create({ baseURL: import.meta.env.VITE_APP_FINANZAS_API }); //
Vue.prototype.$axiosRh = axios.create({ baseURL: import.meta.env.VITE_APP_RH_API }); //
Vue.prototype.$axiosCompaq = axios.create({ baseURL: import.meta.env.VITE_APP_COMPAQ_API }); //
Vue.prototype.$axiosDeportes = axios.create({ baseURL: import.meta.env.VITE_APP_DEPORTES_API }); //


Vue.config.productionTip = false
Vue.use(Storage,{namespace:'vuejs__',name:'ls',storage:'session'});

Vue.directive("mask",mask)
Vue.directive("currency",CurrencyDirective)
Vue.use(axiosPlugin)
Vue.use(VuetifyConfirm,{vuetify,buttonTrueText: 'Si',buttonFalseText: 'No',color: 'white',})

Vue.use(VuetifyToast, {
	x: 'right', // default
	y: 'bottom', // default
	color: 'warning', // default
	// icon: 'plus',
	timeout: 3000, // default
	dismissable: true, // default
	autoHeight: false, // default
	multiLine: false, // default
	vertical: false, // default
	shorts: {
		custom: {
			color: 'purple'
		}
	},
	property: '$toast' // default
})

Vue.component('svg-icon',SvgIcon);


const vm =new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
})
if(vm.$ls.get('logueado',false))vm.$mount('#app')
else window.location.replace(`${import.meta.env.BASE_URL}login.html`);