import {Component} from 'react'
import {Link} from "react-router-dom";

import Moment from 'moment'

import {IconButton} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import classes from "./Movie.module.css"

export class Movie extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {title, release_date, rating, categories} = this.props;
        const final_title = title.toString()[0].toUpperCase() +
            title.toString().substring(1).toLowerCase()
        return (
            <tr className={classes.Movie}>
                <td className={classes.MovieTitle}><img
                    src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y" alt="image"/></td>
                <td className={classes.MovieTitle}>{final_title}<span
                    className={classes.MovieYear}>({Moment(release_date).format('YYYY')})</span></td>
                <td className={classes.MovieRating}>&#11088; {rating}</td>
                <td className={classes.MovieRating}>{categories.length > 0 ? categories.map((k, idx) => (
                    <p className={classes.MovieSpan} key={idx}>{k}</p>
                )) : <p className={classes.MovieSpan}>&#8709;</p>}</td>
                <td>
                    <IconButton onClick={this.props.handleDelete} disabled={!this.props.canDelete}>
                        <a>
                            <DeleteIcon
                                color={!this.props.canDelete ? 'disabled' : 'primary'}
                                fontSize="small"/>
                        </a>
                    </IconButton>
                    <IconButton disabled={!this.props.canEdit}>
                        <Link to={'edit/movie/' + this.props.editMovie}>
                            <EditIcon
                                color={!this.props.canEdit ? 'disabled' : 'primary'}
                                fontSize="small"/>
                        </Link>
                    </IconButton>
                </td>
            </tr>
        )
    }
}

export default Movie;