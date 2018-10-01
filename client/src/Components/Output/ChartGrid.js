import React, { Component } from 'react';
import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import GridPaper from '../GridPaper'
import Chart from './Chart'

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto'
  },
  nested: {
    paddingLeft: theme.spacing.unit * 5,
  },
});

class ChartGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      json: [],
      right: 1,
      left: 0,
      bottom: 0,
      top: 1
    }
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let data = JSON.parse(JSON.stringify(nextProps.data));
    //console.log(data)
    let json = [];
    data.list.map(item => {
      item.raw.map(content => {
        if(content.display) json.push(content);
      })
    });
    //console.log(json)
    let left = Math.min(...json.map(item => 
        Math.min(...item.data.map(d =>
          d.x
        ))
      )
    )
    left = left == Infinity ? 1 : left;
    let right = Math.max(...json.map(item => 
        Math.max(...item.data.map(d =>
          d.x
        ))
      )
    )
    right = right == -Infinity ? 0 : right;
    let bottom = Math.min(...json.map(item => 
        Math.min(...item.data.map(d =>
          d.y
        ))
      )
    )
    bottom = bottom == Infinity ? 0 : Math.floor(bottom*10)/10;
    let top = Math.max(...json.map(item => 
        Math.max(...item.data.map(d =>
          d.y
        ))
      )
    )
    top = top == -Infinity ? 1 : Math.ceil(top*10)/10;
    this.setState({ json, right, left, bottom, top });
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

  render() {
    const { classes, xs } = this.props;
    const { json, left, right, bottom, top } = this.state;
    return (
      <GridPaper xs={xs} className={classes.root}>
        <Chart json={json} left={left} right={right} bottom={bottom} top={top} />
      </GridPaper>
    );
  }
}

ChartGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChartGrid);