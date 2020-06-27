const _ = require('lodash');

function defaultCourier(){
    const id = _.uniqueId();
    return {
        id: id,
        name: `Unnamed ${id}`,
        startTime: new Date(0, 0, 0, 9),
        endTime: new Date(0, 0, 0, 17),
        capacity: 10
    }
}

function demoCouriers(){
    return [{
        id: _.uniqueId(),
        name: 'Badger',
        startTime: new Date(0, 0, 0, 9, 15),
        endTime: new Date(0, 0, 0, 17),
        capacity: 20
    }, {
        id: _.uniqueId(),
        name: 'Toad',
        startTime: new Date(0, 0, 0, 8, 45),
        endTime: new Date(0, 0, 0, 21),
        capacity: 2
    }, {
        id: _.uniqueId(),
        name: 'Weasle',
        startTime: new Date(0, 0, 0, 6, 15),
        endTime: new Date(0, 0, 0, 16, 30),
        capacity: 7
    }, {
        id: _.uniqueId(),
        name: 'Mole',
        startTime: new Date(0, 0, 0, 9, 20),
        endTime: new Date(0, 0, 0, 17, 30),
        capacity: 14
    }, {
        id: _.uniqueId(),
        name: 'Rat',
        startTime: new Date(0, 0, 0, 8, 15),
        endTime: new Date(0, 0, 0, 17, 15),
        capacity: 9
    }];
}

const FleetView = {
    name: 'FleetView',
    data(){
        return {
            couriers: demoCouriers(),
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
        onUpdateCourier(newVal){
            const index = _.findIndex(this.couriers, {id: newVal.id});
            this.couriers.splice(index, 1, newVal);
        },
        onAddCourier(ev){
            this.couriers.splice(this.selectedCourierIndex, 0, defaultCourier());
            if(this.selectedCourierIndex === -1){
                this.selectedCourierIndex = 0;
            }
        },
        onRemoveCourier(ev){
            const removeIndex = this.selectedCourierIndex;
            if(!window.confirm(`Remove ${this.couriers[removeIndex].name}?`)){
                return;
            }
            this.couriers.splice(removeIndex, 1);
            if(this.selectedCourierIndex === this.couriers.length){
                this.selectedCourierIndex = this.couriers.length - 1;
            }
        }
    },
    render(){
        return (
            <div class="fleet">
                <h2>Fleet</h2>
                <div class="courier-list-scroll">
                    <CourierListView
                        couriers={this.couriers}
                        selectedCourierIndex={this.selectedCourierIndex}
                        onSelectCourier={this.onSelectCourier}
                    />
                </div>
                <input
                    type="button"
                    value=" + "
                    onClick={this.onAddCourier}
                />
                <input
                    type="button"
                    value=" - "
                    onClick={this.onRemoveCourier}
                    disabled={this.selectedCourierIndex < 0}
                />
                <h2>Courier</h2>
                <CourierView
                    courier={this.selectedCourier}
                    onUpdate={this.onUpdateCourier}
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
        },
        formatTime(datetime){
            return datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    },
    render(){
        return (
            <ul class="couriers">
                {
                    _.map(this.couriers, (courier, index) => (
                        <li
                            class={ {selected: index === this.selectedCourierIndex, 'couriers-row': true} }>
                            <label >
                                <input
                                   class="hidden"
                                   type="radio"
                                   name="couriers"
                                   checked={index === this.selectedCourierIndex}
                                   value={index}
                                   key={courier.id}
                                   onChange={this.onChangeSelected}
                                />
                                <span class="couriers-title">{courier.name}</span>
                                <span class="couriers-deets">{this.formatTime(courier.startTime)} - {this.formatTime(courier.endTime)}</span>
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
            const hhmm = strTime.split(':').map(item => parseInt(item, 10));
            return new Date(0, 0, 0, hhmm[0], hhmm[1]);
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
    computed: {
        modified(){
            return _.isEqual(this.courier, this.editing);
        }
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
                    <span>Name:&nbsp;</span>
                    <input type="text" v-model={this.editing.name} />
                </label>
                <br/>
                <label>
                    <span>Hours:&nbsp;</span>
                    <TimeInput v-model={this.editing.startTime} />
                    <TimeInput v-model={this.editing.endTime}/>
                </label>
                <label>
                    <span>Capacity:&nbsp;</span>
                    <input type="number" v-model={this.editing.capacity} />
                </label>
                <div class="courier-buttons">
                    <input type="button"
                        value="Update"
                        onClick={this.update}
                        disabled={this.modified}
                    >Update</input>
                    &nbsp;
                    <input
                        type="button"
                        value="Cancel"
                        onClick={this.reset}
                        disabled={this.modified}
                    >Cancel</input>
                </div>
            </fieldset>
        );
    }
}


const App = {
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
