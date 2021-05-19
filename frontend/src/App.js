import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'
import axios from "axios";
import {Component} from "react";
import Toolbar from "./components/UI/Navigation/Toolbar/Toolbar";
import Auxiliary from "./hoc/Auxiliary/Auxiliary";
import Homepage from "./components/UI/Pages/Homepage/Homepage";
import Actors from "./components/UI/Pages/Actors/Actors";
import Movies from "./components/UI/Pages/Movies/Movies";
import About from "./components/UI/Pages/About/About";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            logged_in: null,
            user: {}
        }
    }

    checkLoginStatus() {
        axios.get('http://localhost:5001/user')
            .then(response => {
                    this.handleLogin(response.data);
                }
            )
            .catch(error => {
                    this.setState({
                        logged_in: false,
                        user: {}
                    })
                }
            )
    }

    isPurchasing = () => {
        this.setState({purchasing: true})
    }

    isPurchasingCancel = () => {
        this.setState({purchasing: false})
    }

    handleLogin = (data) => {
        this.setState({
            logged_in: data.authenticated,
            user: data.user
        })
    }

    render() {
        return (
            <Auxiliary>
                <Router>
                    <Toolbar/>
                    <Switch>
                        <Route path="/"
                               exact
                               component={(props) => <Homepage currentUser={this.state.user}/>}/>
                        <Route path="/actors"
                               component={(props) => <Actors currentUser={this.state.user}/>}/>
                        <Route path="/movies"
                               component={(props) => <Movies currentUser={this.state.user}/>}/>
                        <Route path="/about"
                               component={(props) => <About/>}/>
                        <Route component={(props) => <Homepage currentUser={this.state.user}/>}/>
                    </Switch>
                </Router>
            </Auxiliary>
        );
    }
}

export default App;
