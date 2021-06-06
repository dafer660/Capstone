import {Component} from 'react'
import {Link} from "react-router-dom";

import {IconButton} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import classes from "./Category.module.css"

export class Category extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {name} = this.props;
        const final_name = name.toString()[0].toUpperCase() +
            name.toString().substring(1).toLowerCase()
        return (
            <tr className={classes.Category}>
                <td></td>
                <td className={classes.CategoryName}>{final_name}</td>
                <td>
                    <IconButton onClick={this.props.handleDelete} disabled={!this.props.canDelete}>
                        <a>
                            <DeleteIcon
                                color={!this.props.canDelete ? 'disabled' : 'primary'}
                                fontSize="small"/>
                        </a>
                    </IconButton>
                    <IconButton disabled={!this.props.canEdit}>
                        <Link to={'edit/category/' + this.props.editCategory}>
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

export default Category;