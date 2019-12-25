const _ = require('lodash');

const StoreInject = {

    name: 'StoreInject',

    computed: {
        storeColour(){
            return this.$store.state.storeColour;
        }
    },
    methods: {
        onColourChange(newValue){
            this.$store.commit('storeColour', newValue);
        }
    },
    render(){
        const scope = _.assign({}, this.$attrs, {
            colour: this.storeColour,
            onColourChange: this.onColourChange
        });
        return this.$scopedSlots.default(scope);
    }

};

module.exports = StoreInject;
