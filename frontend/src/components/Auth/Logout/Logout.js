import React from 'react';
import {useAuth0} from '@auth0/auth0-react';
import styleNavItem from "../../UI/Navigation/NavigationItems/NavigationItem/NavigationItem.module.css";
import {NavLink} from "react-router-dom";

function LogoutButton() {
    const {
        isAuthenticated,
        logout,
    } = useAuth0();

    return isAuthenticated && (
        <li className={styleNavItem.NavigationItem}>
            <NavLink exact to={'/'} onClick={(e) => {
                e.preventDefault()
                logout({returnTo: window.location.origin});
            }}>Log out
            </NavLink>
        </li>

    );
}

export default LogoutButton;