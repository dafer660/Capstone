import {Component} from 'react'
import {Link} from "react-router-dom";
import Moment from 'moment'

import classes from "./Agent.module.css"
import {IconButton} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

export class Agent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {name, joined_in} = this.props;
        const final_name = name.toString()[0].toUpperCase() +
            name.toString().substring(1).toLowerCase()
        return (
            <tr className={classes.Agent}>
                <td className={classes.AgentImage}><img
                    src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y" alt="image"/></td>
                <td>{final_name}</td>
                <td><span className={classes.AgentDate}>{Moment(joined_in).format('DD MMMM YYYY')}</span></td>
                <td className={classes.Icons}>
                    <IconButton onClick={this.props.handleDelete} disabled={!this.props.canDelete}>
                        <a>
                            <DeleteIcon
                                color={!this.props.canEdit ? 'disabled' : 'primary'}
                                fontSize="small"/>
                        </a>
                    </IconButton>
                    <IconButton disabled={!this.props.canEdit}>
                        <Link to={'edit/agent/' + this.props.editAgent}>
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

export default Agent;