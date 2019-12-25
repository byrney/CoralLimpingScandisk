
const StoreView = {

    computed: {
        storeColour: {
            get(){
                return this.$store.state.storeColour;
            },
            set(newv){
                this.$store.commit('storeColour', newv);
            }
        }
    },

    render(){
        return (
            <section class='store' id='controls'>
                <h2>Edit value in the store</h2>
                <label>
                    <span>Store Colour</span>
                    <input v-model={this.storeColour} id="store-colour-input" />
                </label>
            </section>
        );
    }

};

export default StoreView;

