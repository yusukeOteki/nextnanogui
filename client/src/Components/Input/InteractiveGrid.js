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
    marginBottom: theme.spacing.unit * 20,
  },
  demo: {
    height: "100%",
  },
  paper: {
    margin: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
    height: '100%',
    color: theme.palette.text.secondary,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
  footer: {
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
    const { classes, input, counter, keywords, keywordsList } = this.props;
    return (
      <Grid container className={classes.root}>
        <Grid item xs={12} container spacing={16} className={classes.demo} alignItems={`flex-start`} direction={`row`} justify={`center`} >
          <ParametersList keywords={keywords} keywordsList={keywordsList} input={input} xs={3} counter={counter} onEventCallBack={this.changeData} />
          <ParametersTables keywords={keywords} keywordsList={keywordsList} input={input} counter={counter} xs={5} onEventCallBack={this.changeData} />
          <ParametersConverted keywords={keywords} keywordsList={keywordsList} input={input} xs={4} onEventCallBack={this.changeFile} />
        </Grid>
      </Grid>
    );
  }
}

InteractiveGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InteractiveGrid);
