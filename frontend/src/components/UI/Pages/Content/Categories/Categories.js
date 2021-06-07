import React, {Component} from 'react'
import ReactPaginate from "react-paginate"
import {Link} from "react-router-dom";
import {Snackbar} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import Pages from "../../Pages";
import Header from "../../Header/Header";
import Main from "../../Main/Main";
import Category from "./Category/Category";

import classes from "./Categories.module.css"

export class Categories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allCategories: [],
            updateCategory: [],
            currentPage: 1,
            totalCategories: 0,
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
        this.getCategories()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.totalCategories !== this.state.totalCategories) {
            this.getCategories();
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
            this.getCategories();
        });
    }

    handleDelete = (id) => {
        // permission: 'delete:categories'
        let token = sessionStorage.getItem('token')
        let payload, permissions

        payload = this.props.handleGetPayload(token)
        permissions = this.props.handleCan('delete:categories', payload)
        if (permissions) {
            if (window.confirm('are you sure you want to delete the selected Category?')) {
                fetch(`http://localhost:5000/category/${id}`, {
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
                            allCategories: json.categories,
                            totalCategories: json.total_categories,
                            pageCount: Math.ceil(json.total_categories / 10)
                        })
                        this.handleOpen('success', `Category ${json.deleted.name} has been deleted.`);
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

    getCategories = () => {
        // permission: 'get:categories'
        let token = sessionStorage.getItem('token')
        let payload, permissions

        payload = this.props.handleGetPayload(token)
        permissions = this.props.handleCan('get:categories', payload)

        if (permissions) {
            fetch(`http://localhost:5000/categories?page=${this.state.currentPage}&limit=${10}&offset=${this.state.offset}`, {
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
                        allCategories: json.categories,
                        totalCategories: json.total_categories,
                        pageCount: Math.ceil(json.total_categories / 10)
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
                    <div className={classes.CategoriesHeader}>
                        <h2>Categories
                            {this.props.handleCan('post:categories', payload) ?
                                <Link to={"/new-category"} title={'Add a Category'}>
                                    &#43;
                                </Link> :
                                ''}
                        </h2>
                    </div>
                </Header>
                <Main>
                    <div className={classes.CategoriesMain}>
                        <div>
                            {this.state.totalCategories > 0 ? (
                                    <table>
                                        <thead>
                                        <tr>
                                            <th></th>
                                            <th>Name</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.allCategories.map((key, idx) => (
                                            <Category
                                                key={key.id}
                                                name={key.name}
                                                editCategory={key.id}
                                                handleDelete={() => this.handleDelete(key.id)}
                                                canDelete={this.props.handleCan('delete:categories', payload)}
                                                canEdit={this.props.handleCan('patch:categories', payload)}
                                            />
                                        ))}
                                        </tbody>
                                    </table>
                                ) :
                                <p>There are no Categories to display</p>
                            }
                        </div>
                    </div>
                    <div>
                        {this.state.totalCategories > 10 ? <ReactPaginate
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

export default Categories;