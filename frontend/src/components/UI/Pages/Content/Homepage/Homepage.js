import React, {Component} from 'react'
import classes from './Homepage.module.css'
import Pages from "../../Pages";
import Header from "../../Header/Header";
import Main from "../../Main/Main";

class Homepage extends Component {

    render() {
        return (
            <Pages>
                <Header>
                    <h1>Header Component</h1>
                </Header>
                <Main>
                    <h1>Home Page</h1>
                </Main>
            </Pages>

        )
    }
}

export default Homepage