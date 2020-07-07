const _ = require('lodash');
require('./list-edit.css');

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


const ListEdit = {
    name: 'ListEdit',
    props: {
        listLegend: {type: String, require: true},
        itemLegend: {type: String, require: true},
        items: {type: Array, required: true},
        listItemComponent: {type: Object, required: true},
        formComponent: {type: Object, required: true},
        createDefaultItem: {type: Function, required: true},
        listClass: {type: String, required: true},
        listItemClass: {type: String, required: true}
    },
    watch: {
        items(){
            this.reset();
        },
        selectedItemIndex(newVal){
            this._scrollListToIndex(newVal);
        }
    },
    data(){
        return {
            pendingItems: _.clone(this.items),
            selectedItemIndex: this.items.length > 0 ? 0 : -1
        };
    },
    computed: {
        selectedItem(){
            const index = this.selectedItemIndex;
            return index > -1 ? this.pendingItems[index] : null;
        },
        modified(){
            return _.isEqual(this.pendingItems, this.items);
        },
        itemChangeStates(){
            return _.map(this.pendingItems, pending => {
                const original = _.find(this.items, {id: pending.id});
                if(!original){
                    return '+';
                }
                return _.isEqual(pending, original) ? '' : '*';
            });
        }
    },
    methods: {
        _scrollListToIndex(index){
            if(index < 0){
                return;
            }
            const scroll = this.$refs.listScroll;
            this.$refs.listView.scrollToIndex(index, scroll);
        },
        reset(){
            this.pendingItems = _.clone(this.items);
            this.selectedItemIndex = this.items.length > 0 ? 0 : -1;
        },
        update(){
            this.$emit('updateItems', this.pendingItems);
        },
        onSelectItem(index){
            this.selectedItemIndex = index;
        },
        onUpdateItem(newVal){
            const index = _.findIndex(this.pendingItems, {id: newVal.id});
            this.pendingItems.splice(index, 1, newVal);
        },
        onAddItem(ev){
            const pos = Math.max(this.selectedItemIndex, 0);
            this.pendingItems.splice(pos, 0, this.createDefaultItem());
            this.selectedItemIndex = pos;
            this._scrollListToIndex(pos);
            this.$nextTick(() => this.$refs.formView.focus());
        },
        onRemoveItem(ev){
            const removeIndex = this.selectedItemIndex;
            this.pendingItems.splice(removeIndex, 1);
            if(this.selectedItemIndex === this.pendingItems.length){
                this.selectedItemIndex = this.pendingItems.length - 1;
                this._scrollListToIndex(this.selectedItemIndex);
            }
        },
        _move(offset){
            const startPos = this.selectedItemIndex;
            this.pendingItems.splice(startPos + offset, 0, this.pendingItems.splice(startPos, 1)[0]);
            this.selectedItemIndex += offset;
        },
        onListKeyUp(ev){
            if(ev.keyCode === 13){
                this.$refs.formView.focus();
            }
        },
        onNext(){
            this.selectedItemIndex = (this.selectedItemIndex + 1) % this.pendingItems.length;
        },
        onPrev(){
            if(this.selectedItemIndex === 0){
                this.selectedItemIndex = this.pendingItems.length;
            }
            this.selectedItemIndex = (this.selectedItemIndex - 1) % this.pendingItems.length;
        },
        onMoveUp(ev){
            this._move(-1);
        },
        onMoveDown(ev){
            this._move(+1);
        }
    },
    render(){
        const FormComponent = this.formComponent;
        return (
            <div class="list-edit">
                <div class="list-header">
                    <fieldset disabled={this.selectedItemIndex < 0}>
                        <legend>{_.capitalize(this.itemLegend)}</legend>
                        <div class="actions">
                            <input
                                class="destructive-button"
                                type="button"
                                value={"Remove"}
                                onClick={this.onRemoveItem}
                            />
                        </div>
                        <FormComponent
                            ref="formView"
                            original={this.selectedItem}
                            onUpdate={this.onUpdateItem}
                            onRemove={this.onRemoveItem}
                        />
                        <div class="navigation">
                            <input
                                type="button"
                                onClick={this.onPrev}
                                value="Prev"
                                disabled={this.selectedItemIndex <= 0}
                            />
                            &nbsp;
                            <input
                                type="button"
                                onClick={this.onNext}
                                value="Next"
                                disabled={this.selectedItemIndex >= this.pendingItems.length -1 }
                            />
                        </div>
                    </fieldset>
                    <div class="actions">
                        <input type="button"
                            class="submit-button"
                            value={'Update ' +  this.listLegend}
                            onClick={this.update}
                            disabled={this.modified}
                        />
                        &nbsp;
                        <input
                            type="button"
                            class="destructive-button"
                            value={'Reset ' + this.listLegend}
                            onClick={this.reset}
                            disabled={this.modified}
                        />
                    </div>
                    <div>
                        <input
                            type="button"
                            value={'New ' + this.itemLegend}
                            onClick={this.onAddItem}
                        />
                    </div>
                </div>
                <h2>Team</h2>
                <div class="list-move-controls">
                    <div class="fleet-updown">
                        <input type="button"
                            value={"\u2191"}
                            onClick={this.onMoveUp}
                            disabled={this.selectedItemIndex < 1}
                        />
                        &nbsp;
                        <input
                            type="button"
                            value={"\u2193"}
                            onClick={this.onMoveDown}
                            disabled={this.selectedItemIndex < 0 || this.selectedItemIndex >= this.pendingItems.length - 1}
                        />
                    </div>
                </div>
                <div ref="listScroll" class="list-scroll">
                    <ListView
                        ref="listView"
                        nativeOnKeyup={this.onListKeyUp}
                        listItems={this.pendingItems}
                        listItemStates={this.itemChangeStates}
                        selectedIndex={this.selectedItemIndex}
                        onListSelect={this.onSelectItem}
                        listItemComponent={this.listItemComponent}
                        listClass={this.listClass}
                        listItemClass={this.listItemClass}
                    />
                </div>
            </div>
        );
    }
};

const ListView = {
    name: 'ListView',
    props: {
        listItemComponent: {type: Object, require: true},
        listItems: {type: Array, required: true},
        listItemStates: {type: Array, required: true},
        selectedIndex: {type: Number, required: true},
        listClass: {type: String, default: undefined},
        listItemClass: {type: String, required: true}
    },
    methods: {
        scrollToIndex(index, scroller){
            const el = this.$refs.listItemRows[index];
            el && scrollIfNeeded(el, scroller);
        },
        onChangeSelected(ev){
            this.$emit('listSelect', Number(ev.target.value));
        }
    },
    render(){
        const ItemComponent = this.listItemComponent;
        return (
            <ul class={{ "list-view-list": true, [this.listClass]: this.listClass }} >
                {
                    _.map(this.listItems, (item, index) => (
                        <li
                            refInFor="true"
                            ref="listItemRows"
                            key={index}
                            class={ {
                                selected: index === this.selectedIndex,
                                [this.listItemClass]: this.listItemClass
                            } }>
                            <label>
                                <input
                                   class="hidden"
                                   type="radio"
                                   name={this.listItemClass}
                                   checked={index === this.selectedIndex}
                                   value={index}
                                   key={item.id}
                                   onChange={this.onChangeSelected}
                                />
                                <span class="list-item-state">&nbsp;{this.listItemStates[index]}&nbsp;</span>
                                <ItemComponent item={item} />
                            </label>
                        </li>
                    ))
                }
            </ul>
        )
    }

}

module.exports = ListEdit;
