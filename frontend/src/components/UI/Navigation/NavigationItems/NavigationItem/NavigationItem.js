import React from 'react'

import styleNavItem from './NavigationItem.module.css'
import {NavLink} from "react-router-dom";
import {Button} from "@material-ui/core";

class NavigationItem extends React.Component {
    render() {
        let item

        switch (this.props.renderItem) {
            case 'menuItem':
                item = (
                    <NavLink
                        className={styleNavItem.Menu}
                        activeClassName={styleNavItem.active}
                        to={this.props.url}>
                        {this.props.children}
                    </NavLink>
                )
                break;
            case 'menuAdm':
                item = (
                    <a
                        onClick={this.props.onClick}>
                        {this.props.children}
                    </a>
                )
                break;
            default:
                item = (
                    <NavLink
                        activeClassName={styleNavItem.active}
                        to={this.props.url}>
                        {this.props.children}
                    </NavLink>
                )
                break;
        }

        return (
            <li className={styleNavItem.NavigationItem}>
                {item}
            </li>
        )
    }
}

export default NavigationItem