import {Component} from 'react'
import classes from './Main.module.css'

class Main extends Component {

    render() {
        return (
            <div className={classes.Main}>
                {this.props.children}
            </div>
        )
    }
}

export default Main