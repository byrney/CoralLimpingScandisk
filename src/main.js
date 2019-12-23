import Vue from 'vue'
import App from './App.js'
import store from './store'
import './styles.css'

Vue.config.productionTip = false
new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
