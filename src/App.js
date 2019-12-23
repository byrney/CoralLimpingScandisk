const App = {
    methods: {
        onClickAwesome(ev){
            alert(`Isn't it!`);
        }
    },
    render(){
        return (
            <div id="app">
                App goes here
                <p>
                <button onClick={this.onClickAwesome}>Awesome</button>
                </p>
            </div>
        );
    }
}

export default App;
