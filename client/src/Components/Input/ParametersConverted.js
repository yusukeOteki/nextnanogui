import React, { Component } from 'react';
import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { convertJsontoN3 } from '../../Functions/Common';
import GridPaper from '../GridPaper'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class ParametersConverted extends Component {
  constructor(props) {
    super(props);
    this.state = { converted: convertJsontoN3(props.input) };
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
    this.changeTextField = this.changeTextField.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.converted !== convertJsontoN3(nextProps.input)) {
        this.setState({ converted: convertJsontoN3(nextProps.input) });
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
    const { converted } = this.state;
    return (
      <GridPaper xs={xs} >
          <TextField
            id="convertedFileContent"
            label="Input file"
            multiline
            value={converted}
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