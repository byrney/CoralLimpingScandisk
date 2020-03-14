import Vue from 'vue'
import Page from './Page.js'
import './styles.css'
Vue.config.productionTip = false
window.app = new Vue({
    render: h => h(Page)
});
window.app.$mount("#app");
