import React, {Component} from "react";
import Header from "../../UI/Pages/Header/Header";
import Main from "../../UI/Pages/Main/Main";
import Pages from "../../UI/Pages/Pages";
import classes from "./FormMovie.module.css";
import {Link, withRouter} from "react-router-dom";

import {Button, TextField, Select, MenuItem, Checkbox, ListItemText, Input, Snackbar} from '@material-ui/core';
import Moment from "moment";
import Alert from "@material-ui/lab/Alert";


class FormMovie extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formValid: false,
            formUpdate: props.formUpdate,
            formCreate: props.formCreate,
            formErrors: {title: '', release_date: '', actors: '', categories: ''},
            id: null,
            title: '',
            titleValid: false,
            rating: '',
            ratingValid: false,
            release_date: '',
            release_dateValid: false,
            actors: [],
            actorsValid: false,
            categories: [],
            categoriesValid: false,
            allActors: [],
            totalActors: 0,
            allCategories: [],
            totalCategories: 0,
            movie: {
                title: '',
                release_date: '',
                categories: [],
                actors: [],
                rating: ''
            },
            user: null,
            permissions: [],
            open: false,
            severity: '',
            severityMessage: ''
        }
    }

    componentDidMount() {
        this.getAllActors()
        this.getAllCategories()
        if (this.props.match && this.props.match.params.id) {
            this.setState({
                titleValid: true,
                ratingValid: true,
                release_dateValid: true,
                actorsValid: true,
                categoriesValid: true,
                formValid: true,
                id: this.props.match.params.id
            })
            const id = this.props.match.params.id
            this.getMovie(id)
        }
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let titleValid = this.state.titleValid;
        let release_dateValid = this.state.release_dateValid;
        let actorsValid = this.state.actorsValid;
        let categoriesValid = this.state.categoriesValid;

        switch (fieldName) {
            case 'title':
                titleValid = value.length > 0;
                fieldValidationErrors.title = titleValid ? '' : `Title must not be null`;
                break;
            case 'release_date':
                release_dateValid = !isNaN(Date.parse(value));
                fieldValidationErrors.release_date = release_dateValid ? '' : `Date must be valid`;
                break;
            case 'actors':
                actorsValid = value.length > 0;
                fieldValidationErrors.actors = actorsValid ? '' : `You must select at least 1 Actor`;
                break;
            case 'categories':
                categoriesValid = value.length > 0;
                fieldValidationErrors.categories = categoriesValid ? '' : `You must select at least 1 Category`;
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            titleValid: titleValid,
            release_dateValid: release_dateValid,
            actorsValid: actorsValid,
            categoriesValid: categoriesValid,
        }, this.validateForm);
    }

    validateForm() {
        this.setState(
            {
                formValid: this.state.titleValid && this.state.release_dateValid
                    && this.state.actorsValid && this.state.categoriesValid
            }
        );
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

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState(prevState => ({
            movie: {
                ...prevState.movie, [name]: value
            },
            [name]: value
        }), () => {
            this.validateField(name, value)
        })
    }

    getAllActors = async () => {
        // permission: 'get:actors'
        let token = sessionStorage.getItem('token')
        let payload, permissions

        payload = this.props.handleGetPayload(token)
        permissions = this.props.handleCan('get:actors', payload)

        if (permissions) {
            fetch(`http://localhost:5000/actors`, {
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
                        allActors: json.actors,
                        totalActors: json.total_actors,
                        pageCount: Math.ceil(json.total_actors / 10)
                    })
                })
                .catch((error) => {
                    return;
                })
        } else {
            this.handleOpen('error', 'An error has occurred.');
        }
    }

    getMovie = (id) => {
        // Population of the field Agents and Categories is buggy, but works...
        // Need to work on this.

        // permission: 'get:movies'
        let token = sessionStorage.getItem('token')
        let payload, permissions

        payload = this.props.handleGetPayload(token)
        permissions = this.props.handleCan('get:movies', payload)

        if (permissions) {
            fetch(`http://localhost:5000/movie/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token')
                }
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    }
                })
                .then((json) => {
                    this.setState({
                        movie: json.movie
                    })
                })
                .catch((error) => {
                    return;
                })
        } else {
            this.handleOpen('error', 'An error has occurred.');
        }
    }

    getAllCategories = () => {
        // permission: 'get:categories'
        let token = sessionStorage.getItem('token')
        let payload, permissions

        payload = this.props.handleGetPayload(token)
        permissions = this.props.handleCan('get:categories', payload)
        if (permissions) {
            fetch('http://localhost:5000/categories', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token')
                }
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    }
                })
                .then((json) => {
                    this.setState({
                        allCategories: json.categories,
                        totalCategories: json.total_categories
                    })
                })
                .catch((error) => {
                    return;
                })
        } else {
            this.handleOpen('error', 'An error has occurred.');
        }
    }

    handleMovie = (ev) => {
        ev.preventDefault();
        let method, url, movie, payload, permissions
        // permission: 'patch:movies' or 'post:movies'
        let token = sessionStorage.getItem('token')
        payload = this.props.handleGetPayload(token)


        if (this.props.formUpdate) {
            movie = this.state.movie
            method = 'PATCH'
            url = `/update/movie/${this.state.id}`
            permissions = this.props.handleCan('patch:movies', payload)
        } else {
            const title = this.state.title
            const release_date = this.state.release_date
            const rating = this.state.rating
            const actors = this.state.actors
            const categories = this.state.categories
            method = 'POST'
            url = '/movie'
            permissions = this.props.handleCan('post:movies', payload)

            movie = {title, release_date, rating, actors, categories}
        }

        const requestOptions = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            body: JSON.stringify(
                {
                    title: movie.title,
                    release_date: movie.release_date,
                    rating: movie.rating,
                    actors: movie.actors,
                    categories: movie.categories
                }
            )
        };
        if (permissions) {
            fetch(`http://localhost:5000${url}`, requestOptions)
                .then((result) => {
                    if (result.status === 200) {
                        this.props.history.push('/movies');
                        return;
                    }
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
                    <div className={classes.Header}>
                        <div className={classes.Header}>
                            {this.props.formCreate ? <h2>Add a New Movie</h2> : <h2>Edit Movie</h2>}
                        </div>
                    </div>
                </Header>
                <Main>
                    <div className={classes.FormMovie}>
                        <form id="add-movie-form">
                            <label>
                                Title
                                <input type="text"
                                       name="title"
                                       onChange={this.handleChange}
                                       value={this.state.movie !== null ? this.state.movie.title : ''}/>
                                {this.state.formErrors.title !== '' ? <p>{this.state.formErrors.title}</p> :
                                    <p>&nbsp;</p>}
                            </label>
                            <label>
                                Release Date
                                <TextField
                                    id="date"
                                    type="date"
                                    name={'release_date'}
                                    onChange={this.handleChange}
                                    value={this.state.actor !== null ?
                                        Moment(this.state.movie.release_date).format('YYYY-MM-DD') :
                                        Moment(this.state.release_date).format('YYYY-MM-DD')}
                                    InputLabelProps={{
                                        shrink: true,
                                        display: null
                                    }}
                                />
                                {this.state.formErrors.release_date !== '' ?
                                    <p>{this.state.formErrors.release_date}</p> :
                                    <p>&nbsp;</p>}
                            </label>
                            <label>
                                Rating
                                <select name="rating"
                                        onChange={this.handleChange}
                                        value={this.state.movie !== null ? this.state.movie.rating : ''}>
                                    {Array(10).fill(1).map((_, i) => {
                                        return (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        )
                                    })}
                                </select>
                                <p>&nbsp;</p>
                            </label>
                            <label>
                                Actors
                                <Select
                                    labelId="actors"
                                    id="actors"
                                    name='actors'
                                    multiple
                                    value={this.state.actors}
                                    onChange={this.handleChange}
                                    input={<Input/>}
                                    renderValue={(selected) => (selected.join(', '))}
                                >
                                    {this.state.allActors.map((key, id) => {
                                        return (
                                            <MenuItem key={key.id} value={key.name}>
                                                <Checkbox checked={this.state.movie !== null ?
                                                    this.state.movie.actors.indexOf(key.name) > -1 :
                                                    this.state.actors.indexOf(key.name) > -1}/>
                                                <ListItemText primary={key.name}/>
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                                {this.state.formErrors.actors !== '' ? <p>{this.state.formErrors.actors}</p> :
                                    <p>&nbsp;</p>}
                            </label>
                            <label>
                                Categories
                                <Select
                                    labelId="categories"
                                    id="categories"
                                    name='categories'
                                    multiple
                                    value={this.state.categories}
                                    onChange={this.handleChange}
                                    input={<Input/>}
                                    renderValue={(selected) => (selected.join(', '))}
                                >
                                    {this.state.allCategories.map((key, id) => {
                                        return (
                                            <MenuItem key={key.id} value={key.name}>
                                                <Checkbox
                                                    checked={this.state.movie !== null ?
                                                        this.state.movie.categories.indexOf(key.name) > -1 :
                                                        this.state.categories.indexOf(key.name) > -1}/>
                                                <ListItemText primary={key.name}/>
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                                {this.state.formErrors.categories !== '' ?
                                    <p>{this.state.formErrors.categories}</p> :
                                    <p>&nbsp;</p>}
                            </label>
                            <br/>
                            <Button fullWidth variant="contained" color="primary" onClick={this.handleMovie}
                                    size="large" disabled={!this.state.formValid}>
                                Submit
                            </Button>
                        </form>
                    </div>
                </Main>
            </Pages>
        )
    }
}

export default withRouter(FormMovie);


