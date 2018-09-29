import React, { Component } from 'react';
import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';

import GridPaper from '../GridPaper'

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 5,
  },
});

class ParametersList extends Component {
  constructor(props){
    super(props);
    
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
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

  handleClickCheck (e, item) {
    if(!this.props.keywords[item].required){
      let tempInput = JSON.parse(JSON.stringify(this.props.input));
      tempInput[item].selected = !tempInput[item].selected;
      this.props.onEventCallBack(tempInput, this.props.counter);
    }
  };

  render() {
    const { classes, xs, keywords, keywordsList, input } = this.props;

    return (
      <GridPaper xs={xs}>
        <List
        component="nav"
        subheader={<ListSubheader component="div" style={{backgroundColor: 'white'}}>Input Parameters</ListSubheader>}
        dense={true}
      >
        {keywordsList.map(item => {
          return [(
              <Divider key={item+'Divider'} />
            ),(
            <ListItem key={item+'ListItem'} button onClick={e => this.handleClickCheck(e, item)}>
              {/*<ListItemIcon>
                <InboxIcon />
              </ListItemIcon>*/}
              <ListItemText 
                primary={
                  <Typography variant="body2" color='error'>
                    {`$${keywords[item].section}`}
                  </Typography>
                }
              />
              { keywords[item].required ? '' :
                <Switch
                  checked={input[item].selected === true}
                />
              }
            </ListItem>
          ),
          (
            <Collapse key={item+'Collapse'} in={false} timeout="auto" unmountOnExit>
              <List component="div" disablePadding dense={true}>
                {Object.keys(keywords[item].properties).map(property => {
                  return (
                    <ListItem key={property+'ListItem'} button className={classes.nested}>
                      {/*<ListItemIcon>
                        <StarBorder />
                      </ListItemIcon>*/}
                      <ListItemText
                        primary={
                          <Typography variant="body2" color='default'>
                            {`${property}`}
                          </Typography>
                        }
                      />
                    </ListItem>
                  )
                })}
              </List>
            </Collapse>
          )]
        })}
      </List>
      </GridPaper>
    );
  }
}

ParametersList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ParametersList);