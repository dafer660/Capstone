import React, {Component} from 'react'
import Auxiliary from "../Auxiliary/Auxiliary";
import classes from "./Layout.module.css"
import Footer from "../../components/UI/Navigation/Footer/Footer";

class Layout extends Component {
    render() {
        return (
            <Auxiliary>
                <div className={classes.Content}>
                    <main>
                        {this.props.children}
                    </main>
                    <Footer/>
                </div>
            </Auxiliary>
        )
    }
}

export default Layout
