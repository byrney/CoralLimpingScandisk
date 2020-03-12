import Model from './Model.js'
import Vue from 'vue'

const ViewComputed = {
    name: 'ViewComputed',
    inject: ['appModel'],
    render(){
        return (
            <div>Output: { this.appModel.output }</div>
        );
    }
};

const ViewData = {
    name: 'ViewData',
    inject: ['appModel'],
    render(){
        return (
            <div>
                <span>Input1: { this.appModel.input1 }</span> &nbsp;
                <span>Input2: { this.appModel.input2 }</span>
            </div>
        );
    }
};

const ViewMutator = {
    name: 'ViewMutator',
    inject: ['appModel'],
    methods: {
        onClickChange(ev){
            this.appModel.doubleInput1();
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
    inject: ['appModel'],
    created(){
        this.appModel.$on('changeInput1', this.onInputChange);
    },
    methods: {
        onInputChange(ev){
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

    data(){
        return {
            model: new Vue(Model)
        };
    },

    provide(){
        return {
            appModel: this.model
        }
    },

    created(){
    },

    methods: {
        onClickButton(ev){
            this.model.incrementInput2();
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
                <span>Input1: {this.model.input1}, Output: {this.model.output}</span>
                <div class='component-container'>
                    <h2> View Data</h2>
                    <p>This view takes the model as a prop and renders the model data</p>
                    <ViewData appModel={this.model}/>
                </div>
                <div class='component-container'>
                    <h2> View Computed</h2>
                    <p>This view takes the model as a prop and renders a computed</p>
                    <ViewComputed appModel={this.model}/>
                </div>
                <div class='component-container'>
                    <h2> View Mutate</h2>
                    <p>This view takes the model as a prop and calls a mutator on it</p>
                    <ViewMutator appModel={this.model}/>
                </div>
                <div class='component-container'>
                    <h2> View Subscriber</h2>
                    <p>This view takes the model as a prop and subscribes to an event</p>
                    <ViewSubscriber appModel={this.model}/>
                </div>
                <div class='component-container'>
                    <h2> View Input Prop</h2>
                    <p>This view takes model data as a prop and and renders it</p>
                    <ViewInputProp input1={this.model.input1}/>
                </div>
            </div>
        );
    }
}

export default Page;
