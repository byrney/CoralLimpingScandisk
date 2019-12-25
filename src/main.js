import Vue from 'vue'
import App from './App.js'
import Vuex from 'vuex'
import './styles.css'

Vue.use(Vuex);

const theStore = new Vuex.Store({
       state: {
           storeColour: 'red'
       },
       mutations: {
           storeColour(state, newv){
                state.storeColour = newv;
           }
       }
});

Vue.config.productionTip = false
new Vue({
    store: theStore,
    render: h => h(App)
}).$mount("#app");
