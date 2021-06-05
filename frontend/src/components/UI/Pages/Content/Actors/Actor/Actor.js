import {Component} from 'react'
import {Link} from "react-router-dom";
import Moment from 'moment'

import classes from "./Actor.module.css"
import {IconButton} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

export class Actor extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {name, age, gender, joined_in, agent} = this.props;
        const final_name = name.toString()[0].toUpperCase() +
            name.toString().substring(1).toLowerCase()
        return (
            <tr className={classes.Actor}>
                <td className={classes.ActorImage}><img
                    src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y" alt="image"/></td>
                <td>{final_name}</td>
                <td>{age}</td>
                <td>{gender}</td>
                <td><span className={classes.ActorDate}>{Moment(joined_in).format('DD MMMM YYYY')}</span></td>
                <td className={classes.ActorAgent}><span>{
                    agent != null ? agent :
                        <span>Not represented by any Agent</span>}</span></td>
                <td className={classes.Icons}>
                    <IconButton onClick={this.props.handleDelete} disabled={!this.props.canDelete}>
                        <a>
                            <DeleteIcon color={!this.props.canDelete ? 'disabled' : 'primary'} fontSize="small"/>
                        </a>
                    </IconButton>
                    <IconButton disabled={!this.props.canEdit}>
                        <Link to={'edit/actor/' + this.props.editActor}>
                            <EditIcon color={!this.props.canEdit ? 'disabled' : 'primary'} fontSize="small"/>
                        </Link>
                    </IconButton>
                </td>
            </tr>
        )
    }

}

export default Actor;