import React, {Component} from 'react'
import Pages from "../../Pages";
import Header from "../../Header/Header";
import Main from "../../Main/Main";
import Agent from "./Agent/Agent";
import classes from "./Agents.module.css"

import ReactPaginate from "react-paginate"

import {Link} from "react-router-dom";


export class Agents extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allAgents: [],
            updateActor: [],
            currentPage: 1,
            totalAgents: 0,
            pageCount: 0,
            offset: 0
        }
    }

    componentDidMount() {
        if (this.state.allAgents.length <= 0) {
            this.getAgents()
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.totalAgents !== this.state.totalAgents) {
            this.getAgents();
        }
    }

    handleDelete = (id) => {
        if (window.confirm('are you sure you want to delete the selected Agent?')) {
            fetch(`http://localhost:5000/agent/${id}`, {
                method: 'DELETE'
            })
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    }
                })
                .then((json) => {
                    this.setState({
                        allAgents: json.agents,
                        totalAgents: json.total_agents,
                        pageCount: Math.ceil(json.total_agents / 10)
                    })
                })
                .catch((error) => {
                    return;
                })
        }

    }

    handlePageClick = (data) => {
        let selected = data.selected;
        // let offset = Math.ceil(selected * this.props.perPage);
        let offset = Math.ceil(selected * 10);

        this.setState({offset: offset, currentPage: selected + 1}, () => {
            this.getActors();
        });
    }

    getAgents = () => {
        fetch(`http://localhost:5000/agents?page=${this.state.currentPage}&limit=${10}&offset=${this.state.offset}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then((json) => {
                this.setState({
                    allAgents: json.agents,
                    totalAgents: json.total_agents,
                    pageCount: Math.ceil(json.total_agents / 10)
                })
            })
            .catch((error) => {
                return;
            })
    }

    render() {
        return (
            <Pages>
                <Header>
                    <div className={classes.AgentsHeader}>
                        <h2>Agents
                            <Link to={"/new-agent"} title={'Add an Agent'}>
                                &#43;
                            </Link>
                        </h2>
                    </div>
                </Header>
                <Main>
                    <div className={classes.AgentsMain}>
                        <div>
                            {this.state.totalAgents > 0 ? (
                                    <table>
                                        <thead>
                                        <tr>
                                            <th></th>
                                            <th>Name</th>
                                            <th>Joined in</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.allAgents.map((key, idx) => (
                                            <Agent
                                                key={key.id}
                                                name={key.name}
                                                joined_in={key.joined_in}
                                                editAgent={key.id}
                                                handleDelete={() => this.handleDelete(key.id)}
                                            />
                                        ))}
                                        </tbody>
                                    </table>
                                ) :
                                <p>There are no Agents to display</p>
                            }
                        </div>
                    </div>
                    <div>
                        {this.state.totalAgents > 10 ? <ReactPaginate
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

export default Agents;