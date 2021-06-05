import React from "react";
import classes from "./Loading.module.css"

const loadingImg =
    "https://cdn.auth0.com/blog/auth0-react-sample/assets/loading.svg";

class Loading extends React.Component {
    render() {
        return (
            <div className={classes.Spinner}>
                <img src={loadingImg} alt="Loading..."/>
            </div>
        );
    }
}

export default Loading;