import Vue from 'vue'
import App from './App.js'
import './styles.css'
import Vuikit from 'vuikit'
import '@vuikit/theme'

Vue.use(Vuikit);
Vue.config.productionTip = false
new Vue({
    render: h => h(App)
}).$mount("#app");
