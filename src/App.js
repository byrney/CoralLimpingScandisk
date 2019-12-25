import TwoProps from './TwoProps.js';
import StoreView from './StoreView.js';
import StoreInject from './StoreInject.js';

const App = {

    data(){
        return {
            size: 'massive'
        }
    },

    methods: {

        onColourChange(newVal){
            this.colour = newVal;
        }
    },

    render(){
        const twoProps = (scope) => (
            <TwoProps
                colour={scope.colour}
                size={scope.size}
                onColour={scope.onColourChange}
            />
        );
        return (
            <div id="app">
                <section class='app'>
                    <h2>App</h2>
                        <StoreInject
                            size={this.size}
                            scopedSlots={ {default: twoProps} }
                        />
                </section>
                <StoreView />
            </div>
        );
    }

};


export default App;
