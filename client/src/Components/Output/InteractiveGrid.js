import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import OutputList from './OutputList'

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '80%',
  },
});

class InteractiveGrid extends React.Component {
  constructor(props){
    super(props);
    
    this.changeData = this.changeData.bind(this);
    this.changeFile = this.changeFile.bind(this);
  }

  changeData (changedInput, counter) {
    this.props.onEventCallBack(JSON.stringify(changedInput), 'json', counter);
  }

  changeFile (changedFile) {
    this.props.onEventCallBack(changedFile, "in");
  }

  render() {
    const { classes, output } = this.props;
    return (
      <Grid container className={classes.root}>
        <OutputList output={output} xs={3} onEventCallBack={this.changeData} />{/* 
        <ParametersList output={output} xs={3} onEventCallBack={this.changeData} />
        <ParametersList output={output} xs={6} onEventCallBack={this.changeData} /> */}
      </Grid>
    );
  }
}

InteractiveGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InteractiveGrid);
