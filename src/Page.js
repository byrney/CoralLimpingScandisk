import Vue from 'vue'
import Vuex from 'vuex'
import VuexStore from './vuex-store.js'

Vue.use(Vuex);

const ViewComputed = {
    name: 'ViewComputed',
    render(){
        return (
            <div>Output: { this.$store.getters.output }</div>
        );
    }
};

const ViewData = {
    name: 'ViewData',
    render(){
        return (
            <div>
                <span>Input1: { this.$store.getters.input1 }</span> &nbsp;
                <span>Input2: { this.$store.getters.input2 }</span>
            </div>
        );
    }
};

const ViewMutator = {
    name: 'ViewMutator',
    methods: {
        onClickChange(ev){
            this.$store.commit('doubleInput1');
        }
    },
    render(){
        return (
                <button onClick={this.onClickChange}>Input1 x 2</button>
        );
    }
};

const ViewSubscriber = {
    name: 'ViewSubscriber',
    data() {
        return {
            count: 0
        }
    },
    computed: {
        input1(){
            return this.$store.getters.input1;
        }
    },
    watch: {
        input1(){
            this.count += 1;
        }
    },
    render(){
        return (
            <span>Event Count: { this.count }</span>
        );
    }
};

const ViewInputProp = {
    name: 'ViewInputProp',
    props: {
        input1: {type: Number, required: true}
    },
    render(){
        return (
            <span>Input1 Prop: { this.input1 }</span>
        );
    }
}

const Page = {
    name: 'Page',
    store: VuexStore.create(),
    created(){
    },

    methods: {
        onClickButton(ev){
            this.$store.commit('incrementInput2');
        }
    },
    render(){
        return (
            <div id="app">
                <h1>Page</h1>
                <p>This is the page. It creates the model
                and mutates it via a method when the button is clicked</p>
                <br/>
                <button onClick={this.onClickButton}>Input2 + 1</button>
                <p>App Value</p>
                <span>Input1: {this.$store.getters.input1}, Output: {this.$store.getters.output}</span>
                <div class='component-container'>
                    <h2> View Data</h2>
                    <p>This view takes renders the store data</p>
                    <ViewData />
                </div>
                <div class='component-container'>
                    <h2> View Computed</h2>
                    <p>This view takes renders a derived calculation</p>
                    <ViewComputed/>
                </div>
                <div class='component-container'>
                    <h2> View Mutate</h2>
                    <p>This view calls a mutator on it</p>
                    <ViewMutator />
                </div>
                <div class='component-container'>
                    <h2> View Subscriber</h2>
                    <p>This view takes the model as a prop and subscribes to an event</p>
                    <ViewSubscriber />
                </div>
                <div class='component-container'>
                    <h2> View Input Prop</h2>
                    <p>This view takes model data as a prop and and renders it</p>
                    <ViewInputProp input1={this.$store.getters.input1}/>
                </div>
            </div>
        );
    }
}

export default Page;
