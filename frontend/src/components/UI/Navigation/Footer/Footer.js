import {Component} from 'react'
import classes from "./Footer.module.css"
import {Link} from "react-router-dom";
import github from "../../../../assets/svg/github.svg"
import linkedin from "../../../../assets/svg/linkedin.svg"

class Footer extends Component {

    scrollToTop(e) {
        e.preventDefault()
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    render() {
        return (
            <footer className={classes.Footer}>
                <Link to="#" onClick={(e) => this.scrollToTop(e)}>Back to top</Link>
                <span>2021, Daniel Ferreira LLC
                    {/*<span><a href={''}><img src={github}/></a></span>*/}
                    {/*<span> </span>*/}
                    {/*<span><a href={''}><img src={linkedin}/></a></span>*/}
                </span>
            </footer>
        )
    }
}

export default Footer