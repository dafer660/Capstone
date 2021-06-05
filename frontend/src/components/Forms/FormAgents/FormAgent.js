import React, {Component} from "react";
import Header from "../../UI/Pages/Header/Header";
import Main from "../../UI/Pages/Main/Main";
import Pages from "../../UI/Pages/Pages";
import classes from "./FormAgent.module.css";
import {withRouter} from "react-router-dom";

import {Button, TextField} from '@material-ui/core';
import Moment from "moment";
import {FormErrors} from "../Errors/Errors";
import {string} from "prop-types";


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
            }
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
        fetch(`http://localhost:5000/agent/${id}`)
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
    }

    handleAgent = (ev) => {
        ev.preventDefault();
        let method, url, agent

        if (this.props.formUpdate) {
            agent = this.state.agent
            method = 'PATCH'
            url = `/update/agent/${this.state.id}`
        } else {
            const name = document.getElementsByName('name')[0].value
            const joined_in = document.getElementsByName('joined_in')[0].value
            method = 'POST'
            url = '/agent'

            agent = {name, joined_in}
        }

        const requestOptions = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(
                {
                    name: agent.name,
                    joined_in: agent.joined_in,
                }
            )
        };
        fetch(`http://localhost:5000${url}`, requestOptions)
            .then((result) => {
                if (result.status === 200) {
                    this.props.history.push('/agents');
                    return;
                }
            })
            .catch((error) => {
                alert(`There was an error handling your request\n${error.message}\nPlease try again...!`)
                return;
            })
    }

    render() {
        return (
            <Pages>
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