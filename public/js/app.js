import React, {Component} from 'react'
const Home=()=>(
    <div className="App">
    </div>

)

class App extends Component{
    render(){
        return (
            <Router>
                <Switch>
                    <Route path="/about" component={team_detail}/>
                    <Route path="/" component={Home}/>
                    <Route path="/result" component={result}/>
                </Switch>
            </Router>
        )
    }
}

export default App