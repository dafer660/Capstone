import React, {Component} from "react";
import Header from "../../UI/Pages/Header/Header";
import Main from "../../UI/Pages/Main/Main";
import Pages from "../../UI/Pages/Pages";
import classes from "./FormCategory.module.css";
import {withRouter} from "react-router-dom";

import {Button, Snackbar, TextField} from '@material-ui/core';
import Alert from "@material-ui/lab/Alert";


class FormCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formValid: false,
            formUpdate: props.formUpdate,
            formCreate: props.formCreate,
            formErrors: {name: '', age: '', joined_in: ''},
            id: null,
            name: '',
            nameValid: false,
            category: {
                name: '',
            },
            user: null,
            permissions: [],
            open: false,
            severity: '',
            severityMessage: ''
        }
    }

    componentDidMount() {
        if (this.props.match && this.props.match.params.id) {
            this.setState({
                nameValid: true,
                id: this.props.match.params.id
            })
            const id = this.props.match.params.id
            this.getCategory(id)
        }
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let nameValid = this.state.nameValid;

        switch (fieldName) {
            case 'name':
                nameValid = value.length > 0;
                fieldValidationErrors.name = nameValid ? '' : `Name must not be null`;
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            nameValid: nameValid,
        }, this.validateForm);
    }

    validateForm() {
        this.setState(
            {formValid: this.state.nameValid}
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
            category: {
                ...prevState.category, [name]: value
            }
        }), () => {
            this.validateField(name, value)
        })
    }

    getCategory = (id) => {
        // permission: 'patch:category'
        let token = sessionStorage.getItem('token')
        let payload, permissions

        payload = this.props.handleGetPayload(token)
        permissions = this.props.handleCan('patch:category', payload)
        if (permissions) {
            fetch(`${process.env.REACT_APP_API_URI}/category/${id}`, {
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
                        category: json.category
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

    handleCategory = (ev) => {
        ev.preventDefault();
        let method, url, category, payload, permissions
        // permission: 'patch:categories' or 'post:categories'
        let token = sessionStorage.getItem('token')
        payload = this.props.handleGetPayload(token)

        if (this.props.formUpdate) {
            category = this.state.category
            method = 'PATCH'
            url = `/update/category/${this.state.id}`
            permissions = this.props.handleCan('patch:categories', payload)
        } else {
            const name = document.getElementsByName('name')[0].value
            method = 'POST'
            url = '/category'
            permissions = this.props.handleCan('post:categories', payload)
            category = {name}
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
                    name: category.name,
                }
            )
        };
        if (permissions) {
            fetch(`${process.env.REACT_APP_API_URI}${url}`, requestOptions)
                .then((result) => {
                    if (result.status === 200) {
                        this.props.history.push('/categories');
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
                        {this.props.formCreate ? <h2>Add a New Category</h2> : <h2>Edit Category</h2>}
                    </div>
                </Header>
                <Main>
                    <div className={classes.FormCategory}>
                        <form id="add-category-form">
                            <label>
                                Name
                                <input type="text"
                                       name="name"
                                       onChange={this.handleChange}
                                       value={this.state.category !== null ? this.state.category.name : ''}/>
                                {this.state.formErrors.name !== '' ? <p>{this.state.formErrors.name}</p> :
                                    <p>&nbsp;</p>}
                            </label>
                            <Button fullWidth variant="contained" color="primary" onClick={this.handleCategory}
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

export default withRouter(FormCategory);