import React from 'react';
import {useAuth0} from '@auth0/auth0-react';
import styleNavItem from "../../UI/Navigation/NavigationItems/NavigationItem/NavigationItem.module.css";
import {NavLink} from "react-router-dom";

function LoginButton() {
    const {
        isAuthenticated,
        loginWithPopup,
    } = useAuth0();

    return !isAuthenticated && (
        <li className={styleNavItem.NavigationItem}>
            <NavLink
                exact to={'/'}
                onClick={async (e) => {
                    e.preventDefault()
                    await loginWithPopup({returnTo: window.location.origin});
                }}>
                Log in
            </NavLink>
        </li>
    );
}

export default LoginButton;