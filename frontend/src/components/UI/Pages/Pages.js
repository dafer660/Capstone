import {Component} from 'react'
import classes from './Pages.module.css'

class Pages extends Component {


    render() {
        return (
            <div className={classes.Container}>
                {this.props.children}
            </div>
        )
    }
}

export default Pages