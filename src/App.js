const _ = require('lodash');

function defaultCourier(){
    return {
        id: null,
        name: 'None',
        startTime: new Date(0, 0, 0, 9),
        endTime: new Date(0, 0, 0, 17)
    }
}

const FleetView = {
    name: 'FleetView',
    data(){
        return {
            couriers: [{
                id: 'c0',
                name: 'Badger',
                startTime: new Date(0, 0, 0, 9),
                endTime: new Date(0, 0, 0, 17)
            }, {
                id: 'c1',
                name: 'Toad',
                startTime: new Date(0, 0, 0, 8),
                endTime: new Date(0, 0, 0, 22)
            }],
            selectedCourierIndex: -1,
        };
    },
    computed: {
        selectedCourier(){
            const index = this.selectedCourierIndex;
            return index > -1 ? this.couriers[index] : null;
        }
    },
    methods: {
        onSelectCourier(index){
            this.selectedCourierIndex = index;
        },
        onUpdatedCourier(newVal){
            const index = _.findIndex(this.couriers, {id: newVal.id});
            this.couriers.splice(index, 1, newVal);
        }
    },
    render(){
        return (
            <div class="fleet">
                <h2>Fleet</h2>
                <CourierListView
                    couriers={this.couriers}
                    selectedCourierIndex={this.selectedCourierIndex}
                    onSelectCourier={this.onSelectCourier}
                />
                <h2>Courier</h2>
                <CourierView
                    courier={this.selectedCourier}
                    onUpdate={this.onUpdatedCourier}
                />
            </div>
        );
    }
};

const CourierListView = {
    props: {
        couriers: {type: Array, required: true},
        selectedCourierIndex: {type: Number, required: true}
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
                        <li class={ {selected: index === this.selectedCourierIndex} }>
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
                                <span>{courier.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </label>
                        </li>
                    ))
                }
            </ul>
        )
    }

}

const TimeInput = {
    props: {
        value: {type: Date, default: undefined}
    },
    methods: {
        stringToTime(strTime){
            const arr = strTime.split(':').map(function(item) { return parseInt(item) });
            return new Date(0, 0, 0, arr[0], arr[1]);
        },
        timeToString(datetime){
            return datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        onInput(ev){
            this.$emit('input', this.stringToTime(ev.target.value));
        }
    },
    render(){
        return (
            <input
                type="time"
                value={this.timeToString(this.value)}
                onInput={this.onInput}
            />
        );
    }
};

const CourierView = {
    props: {
        courier: {type: Object, default: null}
    },
    data(){
        return {
            editing: this.courier ? _.clone(this.courier) : defaultCourier()
        };
    },
    watch: {
        courier(){
            this.reset();
        }
    },
    methods: {
        reset(){
            this.editing = this.courier ? _.clone(this.courier) : defaultCourier()
        },
        update(){
            this.$emit('update', this.editing);
        },
    },
    render(){
        return (
            <fieldset class="courier" disabled={this.courier === null}>
                <label>
                    <span>name:&nbsp;</span>
                    <input
                        type="text"
                        v-model={this.editing.name}
                    />
                </label>
                <br/>
                <label>
                    <span>start:&nbsp;</span>
                    <TimeInput v-model={this.editing.startTime} />
                </label>
                <br/>
                <label>
                    <span>end:&nbsp;</span>
                    <TimeInput v-model={this.editing.endTime}/>
                </label>
                <input type="button" value="Update" onClick={this.update}>Update</input>
                <input type="button" value="Cancel" onClick={this.reset}>Cancel</input>
            </fieldset>
        );
    }

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
                <FleetView />
            </div>
        );
    }
}

export default App;
