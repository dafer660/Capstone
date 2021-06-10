import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import {Component} from "react";
import {withAuth0} from '@auth0/auth0-react';
import jwtDecode from "jwt-decode";

import Toolbar from "./components/UI/Navigation/Toolbar/Toolbar";
import Auxiliary from "./hoc/Auxiliary/Auxiliary";
import Homepage from "./components/UI/Pages/Content/Homepage/Homepage";
import Actors from "./components/UI/Pages/Content/Actors/Actors";
import Movies from "./components/UI/Pages/Content/Movies/Movies";
import About from "./components/UI/Pages/Content/About/About";
import Layout from "./hoc/Layout/Layout";
import FormActor from "./components/Forms/FormActors/FormActor";
import FormMovie from "./components/Forms/FormMovie/FormMovie";
import FormAgent from "./components/Forms/FormAgents/FormAgent";
import Agents from "./components/UI/Pages/Content/Agents/Agents";
import Loading from "./hoc/Loading/Loading";
import ProtectedRoute from "./components/Auth/ProtectedRoute/ProtectedRoute";
import FormCategory from "./components/Forms/FormCategory/FormCategory";
import {Categories} from "./components/UI/Pages/Content/Categories/Categories";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            permissions: [],
            token: null,
            user: null
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {user, isAuthenticated} = this.props.auth0

        if (isAuthenticated) {
            if (prevProps.auth0.user !== user) {
                let payload
                this.handleGetToken().then((response => {
                    payload = this.handleGetPayload(response)

                    this.setState({
                        user: user,
                        permissions: payload.permissions
                    })
                }))
            }
        }
    }

    handleGetToken = async () => {
        const {getAccessTokenSilently} = this.props.auth0;
        const token = await getAccessTokenSilently();

        if (token !== sessionStorage.getItem('token') && token !== this.state.token) {
            sessionStorage.setItem('token', token)
            this.setState({
                token: token
            })
        }
        return token;
    }

    handleGetPayload = (token) => {
        return jwtDecode(token)
    }

    handleCan = (permission, payload) => {
        return payload && payload.permissions && payload.permissions.length
            && payload.permissions.indexOf(permission) >= 0;
    }


    render() {
        const {isLoading, isAuthenticated} = this.props.auth0;

        if (isLoading) {
            return <Loading/>;
        }

        if (isAuthenticated) {
            const token = this.handleGetToken()
        }

        return (
            <Auxiliary>
                <Router>
                    <Layout>
                        <Toolbar/>
                        <Switch>
                            <Route path={"/"}
                                   exact
                                   component={(props) => <Homepage/>}/>
                            <ProtectedRoute path="/actors"
                                            component={(props) => <Actors {...props}
                                                                          user={this.state.user}
                                                                          permissions={this.state.permissions}
                                                                          token={this.state.token}
                                                                          handleToken={this.handleGetToken}
                                                                          handleGetPayload={this.handleGetPayload}
                                                                          handleCan={this.handleCan}/>}/>
                            <ProtectedRoute path="/agents"
                                            component={(props) => <Agents {...props}
                                                                          user={this.state.user}
                                                                          permissions={this.state.permissions}
                                                                          token={this.state.token}
                                                                          handleToken={this.handleGetToken}
                                                                          handleGetPayload={this.handleGetPayload}
                                                                          handleCan={this.handleCan}/>}/>
                            <ProtectedRoute path="/categories"
                                            component={(props) => <Categories {...props}
                                                                              user={this.state.user}
                                                                              permissions={this.state.permissions}
                                                                              token={this.state.token}
                                                                              handleToken={this.handleGetToken}
                                                                              handleGetPayload={this.handleGetPayload}
                                                                              handleCan={this.handleCan}/>}/>
                            <ProtectedRoute path="/movies"
                                            component={(props) => <Movies {...props}
                                                                          user={this.state.user}
                                                                          permissions={this.state.permissions}
                                                                          token={this.state.token}
                                                                          handleToken={this.handleGetToken}
                                                                          handleGetPayload={this.handleGetPayload}
                                                                          handleCan={this.handleCan}/>}/>

                            <ProtectedRoute path="/new-actor"
                                            component={(props) => <FormActor {...props}
                                                                             formCreate
                                                                             formUpdate={false}
                                                                             user={this.state.user}
                                                                             permissions={this.state.permissions}
                                                                             token={this.state.token}
                                                                             handleToken={this.handleGetToken}
                                                                             handleGetPayload={this.handleGetPayload}
                                                                             handleCan={this.handleCan}/>}/>
                            <ProtectedRoute exact path="/edit/actor/:id"
                                            component={(props) => <FormActor {...props}
                                                                             formUpdate
                                                                             formCreate={false}
                                                                             user={this.state.user}
                                                                             permissions={this.state.permissions}
                                                                             token={this.state.token}
                                                                             handleToken={this.handleGetToken}
                                                                             handleGetPayload={this.handleGetPayload}
                                                                             handleCan={this.handleCan}/>}/>
                            <ProtectedRoute path="/new-movie"
                                            component={(props) => <FormMovie {...props}
                                                                             formCreate
                                                                             formUpdate={false}
                                                                             user={this.state.user}
                                                                             permissions={this.state.permissions}
                                                                             token={this.state.token}
                                                                             handleToken={this.handleGetToken}
                                                                             handleGetPayload={this.handleGetPayload}
                                                                             handleCan={this.handleCan}/>}/>
                            <ProtectedRoute exact path="/edit/movie/:id"
                                            component={(props) => <FormMovie {...props}
                                                                             formUpdate
                                                                             formCreate={false}
                                                                             user={this.state.user}
                                                                             permissions={this.state.permissions}
                                                                             token={this.state.token}
                                                                             handleToken={this.handleGetToken}
                                                                             handleGetPayload={this.handleGetPayload}
                                                                             handleCan={this.handleCan}/>}/>
                            <ProtectedRoute path="/new-agent"
                                            component={(props) => <FormAgent {...props}
                                                                             formCreate
                                                                             formUpdate={false}
                                                                             user={this.state.user}
                                                                             permissions={this.state.permissions}
                                                                             token={this.state.token}
                                                                             handleToken={this.handleGetToken}
                                                                             handleGetPayload={this.handleGetPayload}
                                                                             handleCan={this.handleCan}/>}/>
                            <ProtectedRoute exact path="/edit/agent/:id"
                                            component={(props) => <FormAgent {...props}
                                                                             formUpdate
                                                                             formCreate={false}
                                                                             user={this.state.user}
                                                                             permissions={this.state.permissions}
                                                                             token={this.state.token}
                                                                             handleToken={this.handleGetToken}
                                                                             handleGetPayload={this.handleGetPayload}
                                                                             handleCan={this.handleCan}/>}/>
                            <ProtectedRoute path="/new-category"
                                            component={(props) => <FormCategory {...props}
                                                                                formCreate
                                                                                formUpdate={false}
                                                                                user={this.state.user}
                                                                                permissions={this.state.permissions}
                                                                                token={this.state.token}
                                                                                handleToken={this.handleGetToken}
                                                                                handleGetPayload={this.handleGetPayload}
                                                                                handleCan={this.handleCan}/>}/>
                            <ProtectedRoute exact path="/edit/category/:id"
                                            component={(props) => <FormCategory {...props}
                                                                                formUpdate
                                                                                formCreate={false}
                                                                                user={this.state.user}
                                                                                permissions={this.state.permissions}
                                                                                token={this.state.token}
                                                                                handleToken={this.handleGetToken}
                                                                                handleGetPayload={this.handleGetPayload}
                                                                                handleCan={this.handleCan}/>}/>
                            <Route path="/about"
                                   component={(props) => <About/>}/>
                            <Route path={'*'} render={() => <Redirect to={"/"} />} />
                        </Switch>
                    </Layout>
                </Router>
            </Auxiliary>
        );
    }
}

export default withAuth0(App);
