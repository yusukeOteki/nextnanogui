import React, { Component } from 'react';
import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import GridPaper from '../GridPaper'

function converting(input){
  let converted = '';
  for(let key in input){
    if(input[key].selected){
        converted += '!********************************************************************************!\n'
        converted += '$'+input[key].section+'\n'
        for(let i = 0; i < input[key].list.length; i++){
          for(let prop in input[key].list[i].properties){
            if(input[key].list[i].properties[prop].selected){
              let value = input[key].list[i].properties[prop].value
              converted += `  ${prop}${' '.repeat(50-prop.length)}= ${typeof value === 'object' ? value.join(' ') : value.toString()}\n`
            }
          }
          converted += i === input[key].list.length - 1 ? '' : '\n'
        }
        converted += '$end_'+input[key].section+'\n'
        converted += '!********************************************************************************!\n\n'        
    }
  }
  return converted;
}

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class ParametersConverted extends Component {
  constructor(props) {
    super(props);
    this.props.onEventCallBack(converting(props.input));
    this.state = {
      converted: converting(props.input),
    };
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
    this.changeTextField = this.changeTextField.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.converted !== converting(nextProps.input)) {
        this.setState({ converted: converting(nextProps.input) });
        this.props.onEventCallBack(converting(nextProps.input));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    /* for(let key in nextProps){
      console.log(key, isEqual(nextProps[key], this.props[key]))
    } */
    const propsDiff = isEqual(nextProps, this.props);
    const stateDiff = isEqual(nextState, this.state);
    /* console.log("propsDiff", propsDiff)
    console.log("stateDiff", stateDiff)
    console.log(!(propsDiff && stateDiff)) */
    return !(propsDiff && stateDiff);
    //return !stateDiff;
  }

  changeTextField(e){
    //this.setState({ converted: e.target.value, });
  }

  render() {
    const { classes, xs } = this.props;
    return (
      <GridPaper xs={xs} >
          <TextField
            id="filled-multiline-static"
            label="Input file"
            multiline
            value={this.state.converted}
            fullWidth
            className={classes.root}
            onChange={e => this.changeTextField(e)}
            />
      </GridPaper>
    );
  }
}

ParametersConverted.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ParametersConverted);