import React from 'react'

import styleNavItems from './NavigationItems.module.css'
import NavigationItem from "./NavigationItem/NavigationItem";
import Search from "../Search/Search";
import LoginButton from "../../../Auth/Login/Login";

const NavigationItems = (props) => {
    return (
        <ul className={styleNavItems.NavigationItems}>
            <Search/>
            <LoginButton>
                Login
            </LoginButton>
            <NavigationItem
                url={'/actors'}>Actors
            </NavigationItem>
            <NavigationItem
                url={'/movies'}>Movies
            </NavigationItem>
            <NavigationItem
                url={'/about'}>About
            </NavigationItem>
        </ul>
    )
}

export default NavigationItems