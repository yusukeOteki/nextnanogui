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
import FolderIcon from '@material-ui/icons/Folder';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';

import GridPaper from '../GridPaper'

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    overflow: 'auto',
  },
});

class OutputList extends Component {
  constructor(props) {
    super(props);
    //this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClickCheck = this.handleClickCheck.bind(this);
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
    if (this.props.output.directoryContents[i].type === 'directory') {
      let output = JSON.parse(JSON.stringify(this.props.output));
      output.directoryContents[i].opened = !output.directoryContents[i].opened;
      this.props.onEventCallBack(output);
    }else{
      this.handleClickCheck(e, i);
    }
  };

  handleClickCheck(e, i, j) {
    let output = JSON.parse(JSON.stringify(this.props.output));
    let item = '';
    if (j >= 0) {
      output.directoryContents[i].contents[j].checked = !output.directoryContents[i].contents[j].checked;
      item = output.directoryContents[i].name + '\\' + output.directoryContents[i].contents[j].name;
    } else {
      output.directoryContents[i].checked = !output.directoryContents[i].checked;
      item = output.directoryContents[i].name;
    }
    this.props.onEventCallBack(output, item);
  };

  render() {
    const { classes, xs, output } = this.props;
    return (
      <GridPaper xs={xs}>
        <List
          component="nav"
          subheader={<ListSubheader disableSticky component="div" >Output files</ListSubheader>}
          dense={true}
          className={classes.root}
        >
          {output.directoryContents && output.directoryContents.map((item, i) => {
            return [(
              <ListItem key={`file-${i}`} button>
                {item.type === 'directory' ? <ListItemIcon><FolderIcon /></ListItemIcon> : <Checkbox checked={item.checked} onClick={e => this.handleClickCheck(e, i)} />}
                <ListItemText primary={`${item.name}`} onClick={e => this.handleClickOpen(e, i)} />
              </ListItem>
            ), (
              <Collapse key={`Collapse-${i}`} in={item.type === 'directory' && item.opened} timeout="auto" unmountOnExit className={classes.nested}>
                {item.type !== 'directory' ? '' :
                  <List component="div" disablePadding dense={true}>
                    {item.contents.map((content, j) => {
                      return (
                        <ListItem key={`file-${i}-${j}`} button onClick={e => this.handleClickCheck(e, i, j)}>
                          <Checkbox checked={content.checked} />
                          <ListItemText primary={`${content.name}`} />
                        </ListItem>
                      )
                    })}
                  </List>
                }
              </Collapse>
            ),(
              <Divider key={'Divider-'+i} />
            )]
          })}
        </List>
      </GridPaper>
    );
  }
}

OutputList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OutputList);