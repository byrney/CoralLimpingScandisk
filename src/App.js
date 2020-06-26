const _ = require('lodash');

const FleetView = {
    name: 'FleetView',
    data(){
        return {
            couriers: [{
                id: 'c0',
                name: 'Badger'
            }, {
                id: 'c1',
                name: 'Toad'
            }],
            selectedCourier: -1,
        };
    },
    methods: {
        onSelectCourier(index){
            console.log(index);
            this.selectedCourier = index;
        }
    },
    render(){
        return (
            <div class="fleet">
                <CourierListView
                    couriers={this.couriers}
                    selectedCourier={this.selectedCourier}
                    onSelectCourier={this.onSelectCourier} />
            </div>
        );
    }
};

const CourierListView = {
    props: {
        couriers: {type: Array, required: true},
        selectedCourier: {type: Number, required: true}
    },
    name: 'CourierListView',
    methods: {
        onChangeSelected(ev){
            this.$emit('selectCourier', Number(ev.target.value));
        }
    },
    render(){
        return (
            <ul class="couriers">
                {
                    _.map(this.couriers, (courier, index) => (
                        <li class="courier-list-item" class={ {selected: index === this.selectedCourier} }>
                            <label >
                                <input
                                   class="hidden"
                                   type="radio"
                                   name="couriers"
                                   value={index}
                                   key={courier.id}
                                   onChange={this.onChangeSelected}
                                />
                                <span>{courier.name}</span>
                            </label>
                        </li>
                    ))
                }
            </ul>
        )
    }

}

const CourierView = {
}


const App = {
    methods: {
        onClickAwesome(ev){
            alert(`Isn't it!`);
        }
    },
    name: 'App',
    render(){
        return (
            <div id="app">
                Hello
                <FleetView />
            </div>
        );
    }
}

export default App;
