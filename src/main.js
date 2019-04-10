import Vue from 'vue'
import store from './store/index'
import App from './App.vue'

Vue.config.productionTip = false

Vue.prototype.$eventHub = new Vue()

new Vue({
	store,
	render: h => h(App)
}).$mount('#app')
