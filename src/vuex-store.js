import Vuex from 'vuex'
import _ from 'lodash'

function create(){
    return new Vuex.Store({
        state: {
            input1: 1,
            input2: 2,
            massiveArray: _.range(1, 100)
        },
        mutations: {
            doubleInput1(state){
                state.input1 *= 2;
            },
            incrementInput2(state){
                state.input2 += 1;
            }
        },
        getters: {
            input1: state => state.input1,
            input2: state => state.input2,
            output: state => state.input1 + state.input2
        }
    });
}

export default {create: create};
