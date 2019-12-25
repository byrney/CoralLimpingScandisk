
const TwoProps = {

    props: {
        colour: { type: String, required: true},
        size: { type: String, required: true}
    },

    methods: {
        onInput(event){
            this.$emit('colour', event.target.value);
        }
    },

    render(){
        return (
            <section class="component">
                <h3>Component which knows nothing about the store</h3>
                <p>Colour: {this.colour}</p>
                <p>Size: {this.size}</p>
                <label>
                    <span>Set Colour</span>
                    <input value={this.colour} onInput={this.onInput} />
                </label>
            </section>
        );
    }

};


export default TwoProps;
