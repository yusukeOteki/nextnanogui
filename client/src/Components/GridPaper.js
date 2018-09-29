import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    height: '100%'
  },
  paper: {
    margin: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
    height: '100%',
    color: theme.palette.text.secondary,
    overflow: 'auto'
  },
});

class GridPaper extends React.Component {
  render() {
    const { classes, children, xs } = this.props;
    return (
      <Grid item xs={xs} className={classes.root}  >
        <Paper className={classes.paper} >
          {children}
        </Paper>
      </Grid>
    );
  }
}

GridPaper.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GridPaper);
