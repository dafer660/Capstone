import React, {Component} from 'react'
import Auxiliary from "../Auxiliary/Auxiliary";
import styleLayout from "./Layout.module.css"

class Layout extends Component {
    render() {
        return (
            <Auxiliary>
                <main className={styleLayout.Content}>
                    {this.props.children}
                </main>
            </Auxiliary>
        )
    }
}

export default Layout
