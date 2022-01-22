import Vue from 'vue'
{{#isEnabled plugins 'axios'}}
import axios from 'axios'
{{/isEnabled}}

import App from './App'
{{#isEnabled plugins 'vue-router'}}
import router from './router'
{{/isEnabled}}
{{#isEnabled plugins 'vuex'}}
import store from './store'
{{/isEnabled}}

{{#isEnabled pluginsFrontend 'bootstrap-vue'}}
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
{{/isEnabled}}

{{#isEnabled plugins 'vue-electron'}}
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
{{/isEnabled}}
{{#isEnabled plugins 'axios'}}
Vue.http = Vue.prototype.$http = axios
{{/isEnabled}}
Vue.config.productionTip = false

{{#isEnabled pluginsFrontend 'bootstrap-vue'}}
Vue.use(IconsPlugin)
Vue.use(BootstrapVue)
{{/isEnabled}}

/* eslint-disable no-new */
const vueJS = new Vue({
  components: { App },
  {{#isEnabled plugins 'vue-router'}}
  router,
  {{/isEnabled}}
  {{#isEnabled plugins 'vuex'}}
  store,
  {{/isEnabled}}
  template: '<App/>'
})
vueJS.$mount('#app')
