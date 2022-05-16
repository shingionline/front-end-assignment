import Vue from 'vue'
import App from './App.vue'

import { BootstrapVue } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import vSelect from "vue-select";
Vue.component("v-select", vSelect); 
import 'vue-select/dist/vue-select.css';

import Multiselect from 'vue-multiselect'
Vue.component('multi-select', Multiselect);

Vue.use(BootstrapVue)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
