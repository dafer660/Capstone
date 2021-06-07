import React, {Component} from 'react'
import Pages from "../../Pages";
import Header from "../../Header/Header";
import Main from "../../Main/Main";
import classes from "./About.module.css";

import img from "../../../../../assets/img/DanielFerreira_Image.jpg"
import beer from "../../../../../assets/img/toast.png"

import {Link} from "react-router-dom";

class About extends Component {
    render() {
        return (
            <Pages>
                <Header>
                    <div className={classes.AboutHeader}>
                        <h2>About me</h2>
                    </div>
                </Header>
                <Main>
                    <div className={classes.AboutMain}>
                        <div className={classes.AboutImg}>
                            <img src={img} alt={'image'}/>
                        </div>
                        <div className={classes.AboutInfo}>
                            <p>
                                Hi! I'm Daniel! This was a website developed to complete the Udacity Capstone project
                                using <span>ReactJS</span> and <span>Python</span>.
                            </p>
                            <p>
                                Here you can check my <span>
                                    <a href={'https://www.linkedin.com/in/daniel-f-684b3666'}
                                       title={'LinkedIn Profile'}
                                       target="_blank"
                                       rel="noopener noreferrer">
                                    LinkedIn profile
                                    </a>
                                </span> and my <span>
                                    <a href={'https://github.com/dafer660'}
                                       title={'Github Profile'}
                                       target="_blank"
                                       rel="noopener noreferrer">
                                    Github profile
                                    </a>
                                </span> as well.
                            </p>
                            <p>
                                A little bit about me...
                            </p>
                            <p>
                                I really like <span>System Administration</span>,
                                using <span>Linux</span> or <span>Windows</span>,however, I tend to go with Linux for
                                servers rather than Windows. Typically, I like to use <span>Proxmox</span>, since I do
                                have a homelab setup with it, and so far, I am really enjoying the experience.
                                Out of the box it has some great tools and allows you to scale as well.
                            </p>
                            <p>
                                In regards to web development, I am still very "green", but I like to play
                                with <span>ReactJS</span> and <span>Flask</span>, as those are my two go tools.
                                For <span>Databases</span>, I find it easy with <span>Postgres</span> and <span>MySQL</span> or <span>MariaDB</span>.
                            </p>
                            <p>
                                I still have a lot to learn, but I am willing to put the work in.
                            </p>

                            <p>
                                Thank you for having the time to read this section and feel free to contact me anytime!
                            </p>

                            <p>
                                Cheers...! <img className={classes.AboutBeer} src={beer} alt={'beer'}/>
                            </p>
                        </div>
                    </div>
                    <a href={"https://www.linkedin.com/in/daniel-f-684b3666"}
                       title={'LinkedIn Profile'}
                       target="_blank"
                       rel="noopener noreferrer">
                    </a>

                </Main>
            </Pages>
        )
    }
}

export default About;