import React, {Component} from 'react'
import Pages from "../../Pages";
import Header from "../../Header/Header";
import Main from "../../Main/Main";
import Actor from "./Actor/Actor";
import classes from "./Actors.module.css"

import ReactPaginate from "react-paginate"
import {Link} from "react-router-dom";
import {Snackbar} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

export class Actors extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allActors: [],
            latestActors: [],
            currentActors: [],
            updateActor: [],
            currentPage: 1,
            totalActors: 0,
            pageCount: 0,
            offset: 0,
            user: null,
            permissions: [],
            open: false,
            severity: '',
            severityMessage: ''
        }
    }

    componentDidMount() {
        this.getActors()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.totalActors !== prevState.totalActors) {
            this.getActors();
        }

        if (prevProps.user !== this.state.user && this.props.user !== this.state.user) {
            this.setState({
                user: this.props.user
            })
        }

        if (sessionStorage.getItem('token') !== this.props.token) {
            sessionStorage.setItem('token', this.props.token)
        }

        if (prevProps.permissions !== this.state.permissions) {
            this.setState({
                permissions: this.props.permissions
            })
        }
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            open: false
        })
    };

    handleOpen = (severity, severityMessage) => {
        this.setState({
            open: true,
            severity: severity,
            severityMessage: severityMessage
        })
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        // let offset = Math.ceil(selected * this.props.perPage);
        let offset = Math.ceil(selected * 10);

        this.setState({offset: offset, currentPage: selected + 1}, () => {
            this.getActors();
        });
    }

    handleUpdate = (id) => {
        // permission: 'patch:actors'
        let token = sessionStorage.getItem('token')
        let payload, permissions

        payload = this.props.handleGetPayload(token)
        permissions = this.props.handleCan('patch:actors', payload)
        if (permissions) {
            // fetch(`http://localhost:5000/actor/${id}`, {
            fetch(`${process.env.REACT_APP_API_URL}/actor/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token')
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        return response.json()
                    }
                })
                .then((json) => {
                    this.setState({
                        updateActor: json.actor
                    })
                })
                .catch((error) => {
                    console.log(error.message)
                    this.handleOpen('error', 'An error has occurred.');
                    return;
                })
        } else {
            this.handleOpen('error', 'An error has occurred.');
        }
    }

    handleDelete = (id) => {
        // permission: 'delete:actors'
        let token = sessionStorage.getItem('token')
        let payload, permissions

        payload = this.props.handleGetPayload(token)
        permissions = this.props.handleCan('delete:actors', payload)
        if (permissions) {
            if (window.confirm('are you sure you want to delete the selected Agent?')) {
                fetch(`${process.env.REACT_APP_API_URL}/actor/${id}`, {
                    // fetch(`http://localhost:5000/actor/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + sessionStorage.getItem('token')
                    }
                })
                    .then((response) => {
                        if (response.status === 200) {
                            return response.json();
                        }
                    })
                    .then((json) => {
                        this.setState({
                            allActors: json.actors,
                            totalActors: json.total_actors,
                            pageCount: Math.ceil(json.total_movies / 10)
                        })
                        this.handleOpen('success', `Actor ${json.deleted.name} has been deleted.`);
                    })
                    .catch((error) => {
                        console.log(error.message)
                        this.handleOpen('error', 'An error has occurred.');
                        return;
                    })
            }
        } else {
            this.handleOpen('error', 'An error has occurred.');
        }

    }

    getActors = () => {
        // permission: 'get:actors'
        let token = sessionStorage.getItem('token')
        let payload, permissions

        payload = this.props.handleGetPayload(token)
        permissions = this.props.handleCan('get:actors', payload)

        if (permissions) {
            fetch(`${process.env.REACT_APP_API_URL}/actors?page=${this.state.currentPage}&limit=${10}&offset=${this.state.offset}`, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token')
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    }
                })
                .then((json) => {
                    this.setState({
                        allActors: json.actors,
                        totalActors: json.total_actors,
                        pageCount: Math.ceil(json.total_actors / 10)
                    })
                })
                .catch((error) => {
                    console.log(error.message)
                    this.handleOpen('error', 'An error has occurred.');
                    return;
                })
        } else {
            this.handleOpen('error', 'An error has occurred.');
        }
    }

    render() {
        this.props.handleToken().then((response => {
            if (sessionStorage.getItem('token') !== response) {
                sessionStorage.setItem('token', response)
            }
        }))

        const payload = this.props.handleGetPayload(sessionStorage.getItem('token'))

        return (
            <Pages>
                <div>
                    <Snackbar open={this.state.open} autoHideDuration={3000} onClose={this.handleClose}>
                        <Alert variant="filled" onClose={this.handleClose} severity={this.state.severity}>
                            {this.state.severityMessage}
                        </Alert>
                    </Snackbar>
                </div>
                <Header>
                    <div className={classes.ActorsHeader}>
                        <h2>Actors
                            {this.props.handleCan('post:actors', payload) ?
                                <Link to={"/new-actor"} title={'Add an Actor'}>
                                    &#43;
                                </Link> :
                                ''}
                        </h2>
                    </div>
                </Header>
                <Main>
                    <div className={classes.ActorsMain}>
                        <div>
                            {this.state.totalActors > 0 ? (
                                    <table>
                                        <thead>
                                        <tr>
                                            <th></th>
                                            <th>Name</th>
                                            <th>Age</th>
                                            <th>Gender</th>
                                            <th>Joined in</th>
                                            <th>Agent</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.allActors.map((key, idx) => (
                                            <Actor
                                                key={key.id}
                                                name={key.name}
                                                age={key.age}
                                                gender={key.gender}
                                                joined_in={key.joined_in}
                                                agent={key.agent}
                                                editActor={key.id}
                                                handleDelete={() => this.handleDelete(key.id)}
                                                canDelete={this.props.handleCan('delete:actors', payload)}
                                                canEdit={this.props.handleCan('patch:actors', payload)}
                                            />
                                        ))}
                                        </tbody>
                                    </table>
                                ) :
                                <p>There are no Actors to display</p>
                            }
                        </div>
                    </div>
                    <div>
                        {this.state.totalActors > 10 ? <ReactPaginate
                            previousLabel={'← Previous'}
                            nextLabel={'Next →'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={this.state.pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={classes.Paginate}
                            previousClassName={classes.PaginateLink}
                            nextClassName={classes.PaginateLink}
                            pageClassName={classes.PaginateLink}
                            disabledClassName={classes.PaginateDisabled}
                            activeClassName={classes.PaginateActive}
                        /> : null}
                    </div>
                </Main>
            </Pages>
        )
    }
}

export default Actors;