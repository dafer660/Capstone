import {Component} from 'react'
import classes from './Header.module.css'

class Header extends Component {

    render() {
        return (
            <div className={classes.Header}>
                {this.props.children}
            </div>
        )
    }
}

export default Header