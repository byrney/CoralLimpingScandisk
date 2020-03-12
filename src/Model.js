import _ from 'lodash';

const Model = {

    name: 'Model',

    data(){
        return {
            input1: 1,
            input2: 2
        };
    },

    created(){
        this.massiveArray = _.range(1, 100);
    },

    computed: {
        output(){
            return this.input1 + this.input2;
        }
    },

    methods: {

        doubleInput1(){
            this.input1 *= 2;
            this.$emit('changeInput1', this.input1);
        },
        incrementInput2(){
            this.input2 += 1;
            this.$emit('changeInput2', this.input2);
        }
    }

};

export default Model;

