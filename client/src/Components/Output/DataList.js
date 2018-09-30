import React, { Component } from 'react';
import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import Checkbox from '@material-ui/core/Checkbox';

import GridPaper from '../GridPaper'

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 5,
  },
});

class DataList extends Component {
  constructor(props) {
    super(props);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClickCheck = this.handleClickCheck.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    //let output = JSON.parse(JSON.stringify(nextProps.output));
    //this.setState({output});
    
  }

  shouldComponentUpdate(nextProps, nextState) {
    /* for(let key in nextProps){
      console.log(key, isEqual(nextProps[key], this.props[key]))
    } */
    const propsDiff = isEqual(nextProps, this.props);
    const stateDiff = isEqual(nextState, this.state);
    /* console.log("propsDiff", propsDiff)
    console.log("stateDiff", stateDiff) */
    //console.log(!(propsDiff && stateDiff))
    return !(propsDiff && stateDiff);
    //return !stateDiff;
  }

  handleClickOpen(e, i) {
    if(this.state.output.directoryContents[i].type === 'directory'){
      let output = JSON.parse(JSON.stringify(this.state.output));
      output.directoryContents[i].opened = !output.directoryContents[i].opened;
      this.props.onEventCallBack(output);
    }
  };

  handleClickCheck(e, i, j) {
    let output = JSON.parse(JSON.stringify(this.state.output));
    if(j >= 0) output.directoryContents[i].contents[j].checked = !output.directoryContents[i].contents[j].checked;
    else output.directoryContents[i].checked = !output.directoryContents[i].checked;
    this.props.onEventCallBack(output);
  };

  render() {
    const { classes, xs, data } = this.props;
    return (
      <GridPaper xs={xs}>
        <List
          component="nav"
          subheader={<ListSubheader component="div" >Input Parameters</ListSubheader>}
          dense={true}
          className={classes.root}
        >
          {data.list && data.list.map((item, i) => {
            return [(
              <ListItem key={`file-${i}`} button onClick={e => this.handleClickOpen(e, i)}>
                <ListItemIcon>{item.type === 'directory' ? <DraftsIcon /> : <InboxIcon />}</ListItemIcon>
                <ListItemText primary={`${item.name}`} />
                {item.type === 'directory' ? '' : <Checkbox checked={item.checked} onClick={e => this.handleClickCheck(e, i)} />}
              </ListItem>
            )/* , (
              <Collapse key={`Collapse-${i}`} in={true} timeout="auto" unmountOnExit>
                {item.type !== 'directory' ? '' :
                  <List component="div" disablePadding dense={true}>
                    {item.contents.map((content, j) => {
                      return (
                        <ListItem key={`file-${i}-${j}`} button className={classes.nested}>
                        <ListItemIcon><InboxIcon /></ListItemIcon>
                        <ListItemText primary={`${content.name}`} />
                        <Checkbox checked={content.checked} onClick={e => this.handleClickCheck(e, i, j)} />
                        </ListItem>
                      )
                    })}
                  </List>
                }
              </Collapse>
            ) */]
          })}
        </List>
      </GridPaper>
    );
  }
}

DataList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DataList);