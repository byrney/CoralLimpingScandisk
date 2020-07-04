const _ = require('lodash');
const FleetTable = require('./fleet-table.js');
const ListEdit = require('./list-edit.js');

function defaultCourier(){
    const id = _.uniqueId();
    return {
        id: id, name: `Unnamed ${id}`, startTime: new Date(0, 0, 0, 9), endTime: new Date(0, 0, 0, 17), capacity: 10
    }
}

function demoCouriers(){
    return [
        { id: _.uniqueId(), name: 'Badger', startTime: new Date(0, 0, 0, 9, 15), endTime: new Date(0, 0, 0, 17), capacity: 20 },
        { id: _.uniqueId(), name: 'Toad', startTime: new Date(0, 0, 0, 8, 45), endTime: new Date(0, 0, 0, 21), capacity: 2 },
        { id: _.uniqueId(), name: 'Weasel', startTime: new Date(0, 0, 0, 6, 15), endTime: new Date(0, 0, 0, 16, 30), capacity: 7 },
        { id: _.uniqueId(), name: 'Mole', startTime: new Date(0, 0, 0, 9, 20), endTime: new Date(0, 0, 0, 17, 30), capacity: 14 },
        { id: _.uniqueId(), name: 'Rat', startTime: new Date(0, 0, 0, 8, 15), endTime: new Date(0, 0, 0, 17, 15), capacity: 9 }
    ];
}

const CourierListItem = {
    name: 'CourierListItem',
    props: {
        item: {type: Object, required: true},
    },
    methods: {
        formatTime(datetime){
            return datetime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        }
    },
    render(){
        return (
            <span>
                <span class="couriers-title">{this.item.name}</span>
                <span class="couriers-deets">{this.formatTime(this.item.startTime)} - {this.formatTime(this.item.endTime)}</span>
            </span>
        )
    }
}

const FleetView = {
    name: 'FleetView',
    props: {
        fleet: {type: Array, required: true}
    },
    methods: {
        onFleetChanged(changed){
            this.$emit('fleetChanged', changed);
        }
    },
    render(){
        return (
            <ListEdit
                items={this.fleet}
                onUpdateItems={this.onFleetChanged}
                listItemComponent={CourierListItem}
                formComponent={CourierView}
                itemLegend="courier"
                listLegend="team"
                createDefaultItem={defaultCourier}
                listClass="couriers"
                listItemClass="couriers-row"
            />
        );
    }
}

const TimeInput = {
    name: 'TimeInput',
    props: {
        value: {type: Date, default: undefined}
    },
    methods: {
        stringToTime(strTime){
            const hhmm = strTime.split(':').map(item => parseInt(item, 10));
            return new Date(0, 0, 0, hhmm[0], hhmm[1]);
        },
        timeToString(datetime){
            return datetime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
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
    name: 'CourierView',
    props: {
        original: {type: Object, default: null}
    },
    data(){
        return {
            editing: this.original ? _.clone(this.original) : defaultCourier()
        };
    },
    watch: {
        original(){
            this.editing = this.original ? _.clone(this.original) : defaultCourier()
        }
    },
    methods: {
        update(){
            this.$emit('update', this.editing);
        },
        focus(){
            this.$refs.nameInput.focus();
            this.$refs.nameInput.select();
        }
    },
    render(){
        return (
            <div class="courier-view">
                <h2 class="courier-title">
                    {this.original ? this.editing.name : 'None'}
                </h2>
                <label>
                    <span>Name:&nbsp;</span>
                    <input ref="nameInput" type="text" v-model={this.editing.name} onInput={this.update}/>
                </label>
                <br/>
                <label>
                    <span>Hours:&nbsp;</span>
                    <TimeInput v-model={this.editing.startTime} onInput={this.update}/>
                    <TimeInput v-model={this.editing.endTime} onInput={this.update}/>
                </label>
                <label>
                    <span>Capacity:&nbsp;</span>
                    <input type="number" v-model={this.editing.capacity} onInput={this.update}/>
                </label>
            </div>
        );
    }
}

const App = {
    name: 'App',
    data(){
        return {
            fleet: demoCouriers()
        }
    },
    methods: {
        onFleetChanged(newFleet){
            this.fleet = newFleet;
        }
    },
    render(){
        return (
            <div id="app">
                <div class="left">
                    <FleetView fleet={this.fleet} onFleetChanged={this.onFleetChanged} />
                </div>
                <div class="right">
                    <FleetTable fleet={this.fleet}/>
                </div>
            </div>
        );
    }
}

export default App;
