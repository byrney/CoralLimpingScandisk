const _ = require('lodash');

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

function scrollIfNeeded(element, container) {
  if (element.offsetTop < container.scrollTop) {
    container.scrollTop = element.offsetTop;
  } else {
    const offsetBottom = element.offsetTop + element.offsetHeight;
    const scrollBottom = container.scrollTop + container.offsetHeight;
    if (offsetBottom > scrollBottom) {
      container.scrollTop = offsetBottom - container.offsetHeight;
    }
  }
}

const FleetView = {
    name: 'FleetView',
    props: {
        fleet: {type: Array, required: true}
    },
    watch: {
        fleet(){
            this.reset();
        },
        selectedCourierIndex(newVal){
            this._scrollListToIndex(newVal);
        }
    },
    data(){
        return {
            couriers: _.clone(this.fleet),
            selectedCourierIndex: this.fleet.length > 0 ? 0 : -1
        };
    },
    computed: {
        selectedCourier(){
            const index = this.selectedCourierIndex;
            return index > -1 ? this.couriers[index] : null;
        },
        modified(){
            return _.isEqual(this.couriers, this.fleet);
        },
        courierStates(){
            return _.map(this.couriers, courier => {
                const fleetCourier = _.find(this.fleet, {id: courier.id});
                if(!fleetCourier){
                    return '+';
                }
                return _.isEqual(courier, fleetCourier) ? '' : '*';
            });
        }
    },
    methods: {
        _scrollListToIndex(index){
            if(index < 0){
                return;
            }
            const scroll = this.$refs.courierListScroll;
            const el = this.$refs.courierList.$refs.courierRows[index];
            el && scrollIfNeeded(el, scroll);
        },
        reset(){
            this.couriers = _.clone(this.fleet);
            this.selectedCourierIndex = this.fleet.length > 0 ? 0 : -1;
        },
        update(){
            this.$emit('fleetChanged', this.couriers);
        },
        onSelectCourier(index){
            this.selectedCourierIndex = index;
        },
        onUpdateCourier(newVal){
            const index = _.findIndex(this.couriers, {id: newVal.id});
            this.couriers.splice(index, 1, newVal);
        },
        onAddCourier(ev){
            const pos = Math.max(this.selectedCourierIndex, 0);
            this.couriers.splice(pos, 0, defaultCourier());
            this.selectedCourierIndex = pos;
            this._scrollListToIndex(pos);
            this.$nextTick(() => this.$refs.courierView.focus());
        },
        onRemoveCourier(ev){
            const removeIndex = this.selectedCourierIndex;
            this.couriers.splice(removeIndex, 1);
            if(this.selectedCourierIndex === this.couriers.length){
                this.selectedCourierIndex = this.couriers.length - 1;
                this._scrollListToIndex(this.selectedCourierIndex);
            }
        },
        _move(offset){
            const startPos = this.selectedCourierIndex;
            this.couriers.splice(startPos + offset, 0, this.couriers.splice(startPos, 1)[0]);
            this.selectedCourierIndex += offset;
        },
        onListKeyUp(ev){
            if(ev.keyCode === 13){
                this.$refs.courierView.focus();
            }
        },
        onNext(){
            this.selectedCourierIndex = (this.selectedCourierIndex + 1) % this.couriers.length;
        },
        onPrev(){
            this.selectedCourierIndex = (this.selectedCourierIndex - 1) % this.couriers.length;
        },
        onMoveUp(ev){
            this._move(-1);
        },
        onMoveDown(ev){
            this._move(+1);
        }
    },
    render(){
        return (
            <div class="fleet">
                <div class="fleet-header">
                    <fieldset class="courier" disabled={this.selectedCourierIndex < 0}>
                        <legend>Couriers</legend>
                        <div class="actions">
                            <input
                                class="destructive-button"
                                type="button"
                                value={"Remove"}
                                onClick={this.onRemoveCourier}
                            />
                        </div>
                        <h2 class="courier-title">
                            {this.selectedCourier ? this.selectedCourier.name : 'None'}
                        </h2>
                        <CourierView
                            ref="courierView"
                            courier={this.selectedCourier}
                            onUpdate={this.onUpdateCourier}
                            onRemove={this.onRemoveCourier}
                        />
                        <div class="navigation">
                            <input
                                type="button"
                                onClick={this.onPrev}
                                value="Prev"
                                disabled={this.selectedCourierIndex <= 0}
                            />
                            &nbsp;
                            <input
                                type="button"
                                onClick={this.onNext}
                                value="Next"
                                disabled={this.selectedCourierIndex >= this.couriers.length -1 }
                            />
                        </div>
                    </fieldset>
                    <div class="actions">
                        <input type="button"
                            class="submit-button"
                            value="Update Fleet"
                            onClick={this.update}
                            disabled={this.modified}
                        />
                        &nbsp;
                        <input
                            type="button"
                            class="destructive-button"
                            value="Reset Fleet"
                            onClick={this.reset}
                            disabled={this.modified}
                        />
                    </div>
                    <div>
                        <input
                            type="button"
                            value={"New Courier"}
                            onClick={this.onAddCourier}
                        />
                    </div>
                </div>
                <h2>Team</h2>
                <div class="fleet-list-controls">
                    <div class="fleet-updown">
                        <input type="button"
                            value={"\u2191"}
                            onClick={this.onMoveUp}
                            disabled={this.selectedCourierIndex < 1}
                        />
                        &nbsp;
                        <input
                            type="button"
                            value={"\u2193"}
                            onClick={this.onMoveDown}
                            disabled={this.selectedCourierIndex < 0 || this.selectedCourierIndex >= this.couriers.length - 1}
                        />
                    </div>
                </div>
                <div ref="courierListScroll" class="courier-list-scroll">
                    <CourierListView
                        ref="courierList"
                        nativeOnKeyup={this.onListKeyUp}
                        couriers={this.couriers}
                        courierStates={this.courierStates}
                        selectedCourierIndex={this.selectedCourierIndex}
                        onSelectCourier={this.onSelectCourier}
                    />
                </div>
            </div>
        );
    }
};

const CourierListView = {
    name: 'CourierListView',
    props: {
        couriers: {type: Array, required: true},
        courierStates: {type: Array, required: true},
        selectedCourierIndex: {type: Number, required: true}
    },
    methods: {
        onChangeSelected(ev){
            this.$emit('selectCourier', Number(ev.target.value));
        },
        formatTime(datetime){
            return datetime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        }
    },
    render(){
        return (
            <ul ref="couriers" class="couriers">
                {
                    _.map(this.couriers, (courier, index) => (
                        <li
                            refInFor="true"
                            ref="courierRows"
                            class={ {
                                selected: index === this.selectedCourierIndex,
                                'couriers-row': true
                            } }>
                            <label>
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
                                <span class="courier-state">&nbsp;{this.courierStates[index]}&nbsp;</span>
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
        courier: {type: Object, default: null}
    },
    data(){
        return {
            editing: this.courier ? _.clone(this.courier) : defaultCourier()
        };
    },
    watch: {
        courier(){
            this.editing = this.courier ? _.clone(this.courier) : defaultCourier()
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
            <div>
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
                <FleetView fleet={this.fleet} onFleetChanged={this.onFleetChanged} />
            </div>
        );
    }
}

export default App;
