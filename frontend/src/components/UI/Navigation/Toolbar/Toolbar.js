import React from 'react'

import styleToolbar from './Toolbar.module.css'

import Logo from "../../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";

const Toolbar = (props) => {
    return (
        <header className={styleToolbar.Toolbar}>
            <div className={styleToolbar.Logo}><Logo/></div>
            <nav>
                <NavigationItems/>
            </nav>
        </header>
    )
}

export default Toolbar