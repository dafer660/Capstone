import React from 'react'

import styleNavItem from './NavigationItem.module.css'
import {NavLink} from "react-router-dom";

const NavigationItem = (props) => {
    return (
        <li className={styleNavItem.NavigationItem}>
            <NavLink
                activeClassName={styleNavItem.active}
                to={props.url}>
                {props.children}
            </NavLink>
        </li>
    )
}

export default NavigationItem