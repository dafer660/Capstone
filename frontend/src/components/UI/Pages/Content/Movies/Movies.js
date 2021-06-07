import React, {Component} from 'react'
import ReactPaginate from "react-paginate";
import {Link} from "react-router-dom";

import Pages from "../../Pages";
import Header from "../../Header/Header";
import Main from "../../Main/Main";
import Movie from "./Movie/Movie";

import classes from "./Movies.module.css";
import Alert from '@material-ui/lab/Alert';
import {Snackbar} from "@material-ui/core";

export class Movies extends Component {

    constructor(props) {
        super(props);

        this.state = {
            allMovies: [],
            latestMovies: [],
            currentMovies: [],
            currentPage: 1,
            totalMovies: 0,
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
        this.getMovies()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.totalMovies !== this.state.totalMovies) {
            this.getMovies();
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

    handleDelete = (id) => {
        // permission: 'delete:movies'
        let token = sessionStorage.getItem('token')
        let payload, permissions

        payload = this.props.handleGetPayload(token)
        permissions = this.props.handleCan('delete:movies', payload)
        if (permissions) {
            if (window.confirm('are you sure you want to delete the selected Movie?')) {
                fetch(`http://localhost:5000/movie/${id}`, {
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
                            allMovies: json.movies,
                            totalMovies: json.total_movies,
                            pageCount: Math.ceil(json.total_movies / 10)
                        })
                        this.handleOpen('success', `Movie ${json.deleted.title} has been deleted.`);
                    })
                    .catch((error) => {
                        return;
                    })
            }
        } else {
            this.handleOpen('error', 'No permissions to delete a Movie.');
        }
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        // let offset = Math.ceil(selected * this.props.perPage);
        let offset = Math.ceil(selected * 10);

        this.setState({offset: offset, currentPage: selected + 1}, () => {
            this.getMovies();
        });
    };

    getMovies = () => {
        // permission: 'get:movies'
        let token = sessionStorage.getItem('token')
        let payload, permissions

        payload = this.props.handleGetPayload(token)
        permissions = this.props.handleCan('get:movies', payload)

        if (permissions) {
            fetch(`http://localhost:5000/movies?page=${this.state.currentPage}&limit=${10}&offset=${this.state.offset}`, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token')
                }
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                })
                .then((json) => {
                    this.setState({
                        allMovies: json.movies,
                        totalMovies: json.total_movies,
                        pageCount: Math.ceil(json.total_movies / 10)
                    })
                })
                .catch((error) => {
                    this.handleOpen('error', 'An error has occurred.');
                    console.log(error.message)
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
                    <div className={classes.MoviesHeader}>
                        <h2>Movies
                            {this.props.handleCan('post:movies', payload) ?
                                <Link to={"/new-movie"} title={'Add a Movie'}>
                                    &#43;
                                </Link> :
                                ''}
                        </h2>
                    </div>
                </Header>
                <Main>
                    <div className={classes.MoviesMain}>
                        <div>
                            {this.state.totalMovies > 0 ? (
                                    <table>
                                        <thead>
                                        <tr>
                                            <th></th>
                                            <th>Title</th>
                                            <th>Rating</th>
                                            <th>Categories</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.allMovies.map((key, idx) => (
                                            <Movie
                                                key={key.id}
                                                title={key.title}
                                                release_date={key.release_date}
                                                rating={key.rating}
                                                categories={key.categories}
                                                editMovie={key.id}
                                                handleDelete={() => this.handleDelete(key.id)}
                                                canDelete={this.props.handleCan('delete:movies', payload)}
                                                canEdit={this.props.handleCan('patch:movies', payload)}
                                            />
                                        ))}
                                        </tbody>
                                    </table>
                                ) :
                                <p>There are no Movies to display</p>
                            }
                        </div>
                    </div>
                    <div>
                        {this.state.totalMovies > 10 ? <ReactPaginate
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

export default Movies;