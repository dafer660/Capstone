import {Component} from 'react'
import {withAuth0} from "@auth0/auth0-react";

import styleNavItems from './NavigationItems.module.css'
import NavigationItem from "./NavigationItem/NavigationItem";
import LoginButton from "../../../Auth/Login/Login";
import LogoutButton from "../../../Auth/Logout/Logout";
import {Menu, MenuItem} from "@material-ui/core";
import {NavLink} from "react-router-dom";

class NavigationItems extends Component {

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

        const {isAuthenticated} = this.props.auth0

        return (
            <ul className={styleNavItems.NavigationItems}>

                {isAuthenticated ?
                    <>
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
                            <NavLink to={'/categories'} activeClassName={styleNavItems.active}>
                                <MenuItem onClick={this.handleClose}>Categories</MenuItem>
                            </NavLink>
                            <NavLink to={'/movies'} activeClassName={styleNavItems.active}>
                                <MenuItem onClick={this.handleClose}>Movies</MenuItem>
                            </NavLink>
                        </Menu>
                    </> : ''}
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

export default withAuth0(NavigationItems);