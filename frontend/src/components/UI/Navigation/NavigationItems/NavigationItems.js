import React from 'react'

import styleNavItems from './NavigationItems.module.css'
import NavigationItem from "./NavigationItem/NavigationItem";
import Search from "../Search/Search";
import LoginButton from "../../../Auth/Login/Login";
import LogoutButton from "../../../Auth/Logout/Logout";
import {Menu, MenuItem} from "@material-ui/core";
import {NavLink} from "react-router-dom";

class NavigationItems extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            anchor: null
        }
    }

    handleClick = (event) => {
        this.setState({
            anchor: event.currentTarget
        })
    }

    handleClose = () => {
        this.setState({
            anchor: null
        })
    }

    render() {

        return (
            <ul className={styleNavItems.NavigationItems}>
                {/*<Search/>*/}
                <NavigationItem renderItem={'menuAdm'} onClick={this.handleClick}>
                    Data
                </NavigationItem>
                <Menu
                    id="NavbarMenu"
                    anchorEl={this.state.anchor}
                    keepMounted
                    open={Boolean(this.state.anchor)}
                    onClose={this.handleClose}
                    className={styleNavItems.Menu}
                >
                    <NavLink to={'/actors'} activeClassName={styleNavItems.active}>
                        <MenuItem onClick={this.handleClose}>Actors</MenuItem>
                    </NavLink>
                    <NavLink to={'/agents'} activeClassName={styleNavItems.active}>
                        <MenuItem onClick={this.handleClose}>Agents</MenuItem>
                    </NavLink>
                    <NavLink to={'/movies'} activeClassName={styleNavItems.active}>
                        <MenuItem onClick={this.handleClose}>Movies</MenuItem>
                    </NavLink>
                </Menu>
                <NavigationItem url={'/about'}>About
                </NavigationItem>
                <LoginButton>
                    Login
                </LoginButton>
                <LogoutButton>
                    Logout
                </LogoutButton>
            </ul>
        )
    }
}

export default NavigationItems