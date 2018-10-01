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
import DraftsIcon from '@material-ui/icons/Drafts';
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
    let data = JSON.parse(JSON.stringify(this.props.data));
    data.list[i].opened = !data.list[i].opened;
    this.props.onEventCallBack(data, i);
  };

  handleClickCheck(e, i, j) {
    let data = JSON.parse(JSON.stringify(this.props.data));
    data.list[i].raw[j].display = !data.list[i].raw[j].display;
    this.props.onEventCallBack(data, i, j);
  };

  render() {
    const { classes, xs, data } = this.props;
    return (
      <GridPaper xs={xs}>
        <List
          component="nav"
          subheader={<ListSubheader disableSticky component="div" >Dat file list</ListSubheader>}
          dense={true}
          className={classes.root}
        >
          {data.list && data.list.map((item, i) => {
            if (item.checked) {
              return [(
                <ListItem key={`file-${i}`} button>
                  {item.raw.length > 1 ? <ListItemIcon><FolderIcon /></ListItemIcon> : <Checkbox checked={item.raw[0].display} onClick={e => this.handleClickCheck(e, i, 0)} />}
                  {/* <ListItemIcon>{item.type === 'directory' ? <DraftsIcon /> : <FolderIcon />}</ListItemIcon> */}
                  <ListItemText secondary={`${item.name}`} onClick={e => this.handleClickOpen(e, i)} />
                </ListItem>
              ), (
                <Collapse key={`Collapse-${i}`} in={item.opened} timeout="auto" unmountOnExit className={classes.nested}>
                  {item.raw.length === 1 ? '' :
                    <List component="div" disablePadding dense={true}>
                      {item.raw.map((content, j) => {
                        return (
                          <ListItem key={`file-${i}-${j}`} button onClick={e => this.handleClickCheck(e, i, j)}>
                            <Checkbox checked={content.display} />
                            {/* <ListItemIcon><FolderIcon /></ListItemIcon> */}
                            <ListItemText secondary={`${content.yLabel}`} />
                          </ListItem>
                        )
                      })}
                    </List>
                  }
                </Collapse>
              ),(
                <Divider key={'Divider-'+i} />
              )]
            }
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