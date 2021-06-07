import React, {Component} from "react";
import Header from "../../UI/Pages/Header/Header";
import Main from "../../UI/Pages/Main/Main";
import Pages from "../../UI/Pages/Pages";
import classes from "./FormAgent.module.css";
import {withRouter} from "react-router-dom";

import {Button, Snackbar, TextField} from '@material-ui/core';
import Moment from "moment";
import Alert from "@material-ui/lab/Alert";


class FormAgent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formValid: false,
            formUpdate: props.formUpdate,
            formCreate: props.formCreate,
            formErrors: {name: '', joined_in: ''},
            id: null,
            name: '',
            nameValid: false,
            joined_in: '',
            joined_inValid: false,
            agent: {
                name: '',
                joined_in: '',
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
                joined_inValid: true,
                formValid: true,
                id: this.props.match.params.id
            })
            const id = this.props.match.params.id
            this.getAgent(id)
        }
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let nameValid = this.state.nameValid;
        let joined_inValid = this.state.joined_inValid;

        switch (fieldName) {
            case 'name':
                nameValid = value.length > 0;
                fieldValidationErrors.name = nameValid ? '' : `Name must not be null`;
                break;
            case 'joined_in':
                joined_inValid = !isNaN(Date.parse(value));
                fieldValidationErrors.joined_in = joined_inValid ? '' : `Date must be valid`;
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            nameValid: nameValid,
            joined_inValid: joined_inValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState(
            {formValid: this.state.nameValid && this.state.joined_inValid}
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
            agent: {
                ...prevState.agent, [name]: value
            }
        }), () => {
            this.validateField(name, value)
        })
    }

    getAgent = (id) => {
        // permission: 'get:agents'
        let token = sessionStorage.getItem('token')
        let payload, permissions

        payload = this.props.handleGetPayload(token)
        permissions = this.props.handleCan('get:agents', payload)

        if (permissions) {
            fetch(`${process.env.REACT_APP_API_URI}/agent/${id}`, {
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
                        agent: json.agent
                    })
                })
                .catch((error) => {
                    alert(`There was an error handling your request\n${error.message}\nPlease try again...!`);
                    return;
                })
        } else {
            this.handleOpen('error', 'An error has occurred.');
        }
    }

    handleAgent = (ev) => {
        ev.preventDefault();
        let method, url, agent, payload, permissions
        // permission: 'patch:agents' or 'post:agents'
        let token = sessionStorage.getItem('token')
        payload = this.props.handleGetPayload(token)

        if (this.props.formUpdate) {
            agent = this.state.agent
            method = 'PATCH'
            url = `/update/agent/${this.state.id}`
            permissions = this.props.handleCan('patch:agents', payload)
        } else {
            const name = document.getElementsByName('name')[0].value
            const joined_in = document.getElementsByName('joined_in')[0].value
            method = 'POST'
            url = '/agent'
            permissions = this.props.handleCan('post:agents', payload)

            agent = {name, joined_in}
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
                    name: agent.name,
                    joined_in: agent.joined_in,
                }
            )
        };
        if (permissions) {
            fetch(`${process.env.REACT_APP_API_URI}${url}`, requestOptions)
                .then((result) => {
                    if (result.status === 200) {
                        this.props.history.push('/agents');
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
                        {this.props.formCreate ? <h2>Add a New Agent</h2> : <h2>Edit Agent</h2>}
                    </div>
                </Header>
                <Main>
                    <div className={classes.FormAgent}>
                        <form id="add-actor-form">
                            <label>
                                Name
                                <input type="text"
                                       name="name"
                                       onChange={this.handleChange}
                                       value={this.state.agent !== null ? this.state.agent.name : ''}/>
                                {this.state.formErrors.name !== '' ? <p>{this.state.formErrors.name}</p> :
                                    <p>&nbsp;</p>}
                            </label>
                            <label>
                                Joined in
                                <TextField
                                    id="date"
                                    type="date"
                                    name={'joined_in'}
                                    onChange={this.handleChange}
                                    value={this.state.agent !== null ?
                                        Moment(this.state.agent.joined_in).format('YYYY-MM-DD') :
                                        Moment(this.state.joined_in).format('YYYY-MM-DD')}
                                    InputLabelProps={{
                                        shrink: true,
                                        display: null
                                    }}
                                />
                            </label>
                            {this.state.formErrors.joined_in !== '' ? <p>{this.state.formErrors.joined_in}</p> :
                                <p>&nbsp;</p>}
                            <p>&nbsp;</p>
                            <Button fullWidth variant="contained" color="primary" onClick={this.handleAgent}
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

export default withRouter(FormAgent);