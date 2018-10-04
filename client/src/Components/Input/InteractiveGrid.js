import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import ParametersList from './ParametersList'
import ParametersTables from './ParametersTables'
import ParametersConverted from './ParametersConverted'

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: "80%"
  },
});

class InteractiveGrid extends React.Component {
  constructor(props){
    super(props);
    this.changeData = this.changeData.bind(this);
  }
  
  changeData (changedInput, counter) {
    this.props.onEventCallBack(JSON.stringify(changedInput), 'json', counter);
  }

  render() {
    const { classes, input, counter } = this.props;
    return (
      <Grid container className={classes.root}>
        <Grid item xs={12} container spacing={16} className={classes.row} alignItems={`flex-start`} direction={`row`} justify={`center`} >
          <ParametersList input={input} xs={3} counter={counter} onEventCallBack={this.changeData} />
          <ParametersTables input={input} counter={counter} xs={5} onEventCallBack={this.changeData} />
          <ParametersConverted input={input} xs={4} />
        </Grid>
      </Grid>
    );
  }
}

InteractiveGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InteractiveGrid);
