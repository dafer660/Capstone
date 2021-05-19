import React from 'react'

import iconLogo from '../../assets/favicon/android-chrome-192x192.png'
import styleLogo from './Logo.module.css'
import {NavLink} from "react-router-dom";

const Logo = (props) => {
    return (
        <div className={styleLogo.Logo}>
            <NavLink to={'/'}>
                <img src={iconLogo} alt="Homepage"/>
            </NavLink>
        </div>
    )
}

export default Logo