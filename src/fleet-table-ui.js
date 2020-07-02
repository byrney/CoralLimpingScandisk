
const VkTable = require('vuikit/lib/table').Table;
const VkTableColumn = require('vuikit/lib/table').TableColumn;
const VkColumnSelect = require('vuikit/lib/table').TableColumnSelect;
const FleetTable = {
    props: {
        fleet: {type: Array, required: true}
    },

    render(){
        return (
            <div class="fleet-table">
                <VkTable
                    data={this.fleet}
                >
                    <VkColumnSelect></VkColumnSelect>
                    <VkTableColumn slot="default" title="Name" cell="name" cellMiddle/>,
                    <VkTableColumn slot="default" title="Capacity" cell="capacity"/>,
                </VkTable>
            </div>
        );
    }
}

module.exports = FleetTable;

