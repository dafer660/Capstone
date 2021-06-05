import React, {Component} from "react";
import Header from "../../UI/Pages/Header/Header";
import Main from "../../UI/Pages/Main/Main";
import Pages from "../../UI/Pages/Pages";
import classes from "./FormActor.module.css";
import {Link, withRouter} from "react-router-dom";

import {Button, Snackbar, TextField} from '@material-ui/core';
import Moment from "moment";
import {FormErrors} from "../Errors/Errors";
import {string} from "prop-types";
import Alert from "@material-ui/lab/Alert";


class FormActor extends Component {
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
            age: 0,
            ageValid: false,
            gender: '',
            joined_in: '',
            joined_inValid: false,
            agent: null,
            actor: {
                name: '',
                age: '',
                gender: '',
                joined_in: '',
                agent: '',
                agent_id: ''
            },
            allAgents: [],
            totalAgents: 0,
            user: null,
            permissions: [],
            open: false,
            severity: '',
            severityMessage: ''
        }
    }

    componentDidMount() {
        this.getAllAgents()
        if (this.props.match && this.props.match.params.id) {
            this.setState({
                nameValid: true,
                ageValid: true,
                joined_inValid: true,
                formValid: true,
                id: this.props.match.params.id
            })
            const id = this.props.match.params.id
            this.getActor(id)
        }
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let nameValid = this.state.nameValid;
        let ageValid = this.state.ageValid;
        let joined_inValid = this.state.joined_inValid;

        switch (fieldName) {
            case 'name':
                nameValid = value.length > 0;
                fieldValidationErrors.name = nameValid ? '' : `Name must not be null`;
                break;
            case 'age':
                ageValid = !isNaN(parseInt(value));
                fieldValidationErrors.age = ageValid ? '' : `Age must be a valid number`;
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
            ageValid: ageValid,
            joined_inValid: joined_inValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState(
            {formValid: this.state.nameValid && this.state.ageValid && this.state.joined_inValid}
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
            actor: {
                ...prevState.actor, [name]: value
            }
        }), () => {
            this.validateField(name, value)
        })
    }

    getAllAgents = () => {
        // permission: 'get:agents'
        let token = sessionStorage.getItem('token')
        let payload, permissions

        payload = this.props.handleGetPayload(token)
        permissions = this.props.handleCan('get:agents', payload)
        if (permissions) {
            fetch('http://localhost:5000/agents', {
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
                        allAgents: json.agents,
                        totalAgents: json.total_agents
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

    getActor = (id) => {
        // permission: 'get:actors'
        let token = sessionStorage.getItem('token')
        let payload, permissions

        payload = this.props.handleGetPayload(token)
        permissions = this.props.handleCan('get:actors', payload)
        if (permissions) {
            fetch(`http://localhost:5000/actor/${id}`, {
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
                        actor: json.actor
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

    handleActor = (ev) => {
        ev.preventDefault();
        let method, url, actor, payload, permissions
        // permission: 'patch:actors' or 'post:actors'
        let token = sessionStorage.getItem('token')
        payload = this.props.handleGetPayload(token)

        if (this.props.formUpdate) {
            actor = this.state.actor
            method = 'PATCH'
            url = `/update/actor/${this.state.id}`
            permissions = this.props.handleCan('patch:actors', payload)
        } else {
            const name = document.getElementsByName('name')[0].value
            const gender = document.getElementsByName('gender')[0].value
            const age = document.getElementsByName('age')[0].value
            const agent_id = document.getElementById('agent_id')[0].value
            const agent = document.getElementById('agent_id')[0].innerText
            const joined_in = document.getElementsByName('joined_in')[0].value
            method = 'POST'
            url = '/actor'
            permissions = this.props.handleCan('post:actors', payload)
            actor = {name, gender, age, agent, joined_in, agent_id}
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
                    name: actor.name,
                    age: actor.age,
                    gender: actor.gender,
                    joined_in: actor.joined_in,
                    agent: actor.agent,
                    agent_id: actor.agent_id
                }
            )
        };
        if (permissions) {
            fetch(`http://localhost:5000${url}`, requestOptions)
                .then((result) => {
                    if (result.status === 200) {
                        this.props.history.push('/actors');
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
                        {this.props.formCreate ? <h2>Add a New Actor</h2> : <h2>Edit Actor</h2>}
                    </div>
                </Header>
                <Main>
                    <div className={classes.FormActor}>
                        <form id="add-actor-form">
                            <label>
                                Name
                                <input type="text"
                                       name="name"
                                       onChange={this.handleChange}
                                       value={this.state.actor !== null ? this.state.actor.name : ''}/>
                                {this.state.formErrors.name !== '' ? <p>{this.state.formErrors.name}</p> :
                                    <p>&nbsp;</p>}
                            </label>
                            <label>
                                Age
                                <input type="text"
                                       name="age"
                                       onChange={this.handleChange}
                                       value={this.state.actor !== null ? this.state.actor.age : ''}/>
                                {this.state.formErrors.age !== '' ? <p>{this.state.formErrors.age}</p> :
                                    <p>&nbsp;</p>}
                            </label>
                            <label>
                                Gender
                                <select name="gender"
                                        id={'gender'}
                                        onChange={this.handleChange}
                                        value={this.state.actor !== null ? this.state.actor.gender : 'Female'}>
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>
                                    <option value="Other">Other</option>
                                </select>
                                <p>&nbsp;</p>
                            </label>
                            <label>
                                Agent
                                <select name="agent_id"
                                        id={'agent_id'}
                                        onChange={this.handleChange}
                                        value={this.state.actor !== null ? this.state.actor.agent_id : ''}>
                                    {this.state.allAgents.map((key, id) => {
                                        return (
                                            <option key={key.id} value={key.id}>{key.name}</option>
                                        )
                                    })}
                                </select>
                                <p>&nbsp;</p>
                            </label>
                            <label>
                                Joined in
                                <TextField
                                    id="date"
                                    type="date"
                                    name={'joined_in'}
                                    onChange={this.handleChange}
                                    value={this.state.actor !== null ?
                                        Moment(this.state.actor.joined_in).format('YYYY-MM-DD') :
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
                            <Button fullWidth variant="contained" color="primary" onClick={this.handleActor}
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

export default withRouter(FormActor);