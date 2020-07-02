
const Vuetable = require('vuetable-2/src/components/Vuetable').default;

const cssUiKit = {
    table: {
        tableClass: 'uk-table uk-table-striped uk-table-hover uk-table-small',
        loadingClass: 'loading',
        // ascendingIcon: 'chevron-up',
        // descendingIcon: 'chevron-down',
        // handleIcon: 'menu',
        // renderIcon (classes, options) {
        //     return `<span uk-icon="icon: ${classes[1]}" class="${classes[0]}"></span>`
        // }
    },
    pagination: {
        wrapperClass: 'vuetable-pagination uk-pagination uk-float-right',
        activeClass: 'uk-active',
        disabledClass: 'uk-disabled',
        pageClass: 'button small outline',
        linkClass: 'button small outline',
        icons: {
            first: '',
            prev: '',
            next: '',
            last: '',
        },
    }
};

const FleetTable = {
    props: {
        fleet: {type: Array, required: true}
    },
    data(){
        return {
            checkedCouriers: this._checkAll()
        }
    },
    watch: {
        fleet(){
            // needed when using dataManager
            this.$refs.vuetable.refresh();
        }
    },
    created(){
        this.fields = [
            {
                name: 'name',
                sortField: 'name',
                title: 'Name',
                width: '60px'
            }, {
                name: 'startTime',
                sortField: 'startTime',
                width: '20px',
                title: 'Start',
                callback: this.formatTime

            }, {
                name: 'endTime',
                sortField: 'endTime',
                width: '20px',
                title: 'End',
                callback: this.formatTime
            }, {
                name: 'capacity',
                sortField: 'capacity',
                width: '20px',
                title: 'Capacity',
                titleClass: 'right aligned',
                dataClass: 'right aligned'
            }, {
                width: '10px',
                name: '__checkbox'
            }

        ];
    },
    mounted(){
        this.$nextTick(() => this.$refs.vuetable.selectedTo = this._checkAll());
    },
    methods: {
        formatTime(datetime){
            return datetime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        },
        dataManager(sortOrder, pagination){
            const fields = _.map(sortOrder, 'sortField');
            const directions = _.map(sortOrder, 'direction');
            const data = _.orderBy(this.fleet, fields, directions);
            return {
                pagination: null,
                data: data
            };
        },
        _checkAll(){
            return _.map(this.fleet, 'id');
        },
        rowCheckboxToggledAll(isChecked){
            if(isChecked){
                this.checkedCouriers = this._checkAll();
            } else {
                this.checkedCouriers = [];
            }
            this.$emit('checkedCouriers', this.checkedCouriers);
        },
        rowCheckboxToggled(isChecked, dataItem){
            if(isChecked){
                this.checkedCouriers.push(dataItem.id);
            } else {
                this.checkedCouriers = _.without(this.checkedCouriers, dataItem.id);
            }
            this.$emit('checkedCouriers', this.checkedCouriers);
        }
    },
    render(h){
        return h(
            'div', {
                class: { 'fleet-table': true },
            }, [
                h(Vuetable, {
                    props: {
                        dataManager: this.dataManager,
                        fields: this.fields,
                        apiMode: false,
                        css: cssUiKit.table,
                        showSortIcons: true,
                        tableHeight: '300px'
                    },
                    on: {
                        'vuetable:checkbox-toggled': this.rowCheckboxToggled,
                        'vuetable:checkbox-toggled-all': this.rowCheckboxToggledAll
                    },
                    ref: 'vuetable'
                })
            ]
        );
    }

}

module.exports = FleetTable;

