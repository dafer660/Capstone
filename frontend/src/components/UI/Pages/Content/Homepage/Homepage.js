import React, {Component} from 'react'

import Pages from "../../Pages";
import Header from "../../Header/Header";
import Main from "../../Main/Main";

import classes from './Homepage.module.css'

import udacityLogo from '../../../../../assets/svg/udacity.svg'
import githubLogo from '../../../../../assets/svg/github.svg'
import beerIcon from '../../../../../assets/img/toast.png'

class Homepage extends Component {

    render() {
        const udacityURL = "https://www.udacity.com"
        const udacityFSWD = "https://www.udacity.com/course/full-stack-web-developer-nanodegree--nd0044"
        const reactURL = "https://reactjs.org/"
        const flaskURL = "https://flask.palletsprojects.com/en/2.0.x/"
        const repoURL = "https://github.com/dafer660/Capstone"

        return (
            <Pages>
                <Header>
                    <div className={classes.HomepageHeader}>
                        <a href={udacityURL} aria-label="Udacity Capstone"><img src={udacityLogo} alt="..."/></a>
                        <h2>Udacity Capstone Project - Full Stack Web Developer</h2>
                        <h3>Casting Agency</h3>
                    </div>
                </Header>
                <Main>
                    <div className={classes.HomepageMain}>
                        <p>This project is based on <span>
                        <a href="https://www.udacity.com"
                           title="Udacity.com"
                           target="_blank"
                           rel="noopener noreferrer">Udacity
                        </a></span> Capstone from the Program <span>
                        <a href={udacityFSWD}
                           title="Udacity FSWD Program"
                           target="_blank"
                           rel="noopener noreferrer">Full Stack Web Developer
                        </a></span>.
                        </p>
                        <p>It was made using <span>
                        <a href={reactURL}
                           title="reactjs.org"
                           target="_blank"
                           rel="noopener noreferrer">ReactJS
                        </a></span>, as the frontend, and <span>
                        <a href={flaskURL}
                           title="flask project"
                           target="_blank"
                           rel="noopener noreferrer">Flask
                        </a></span>, as the backend.</p>
                        <p>The overall program was really cool and allowed me to learn a few things along the way.</p>
                        <p>
                            <a href={repoURL}
                               title="Capstone Github Repository"
                               target="_blank"
                               rel="noopener noreferrer"><span>You can check the repo of this project here <img
                                src={githubLogo}/></span>
                            </a>
                        </p>
                        <hr/>
                        <p><img className={classes.Beer} src={beerIcon} alt="beer"/></p>
                    </div>

                </Main>
            </Pages>

        )
    }
}

export default Homepage