import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import OutputList from './OutputList'
import DataList from './DataList'
import ChartGrid from './ChartGrid'

const { ipcRenderer } = window.require('electron');

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '80%',
  },
});

class OutputGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      output: [],
      data: [],
    }

    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.changeOutput = this.changeOutput.bind(this);
    this.changeData = this.changeData.bind(this);
    this.ShapingDat = this.ShapingDat.bind(this);

  }

  componentWillReceiveProps(nextProps) {
    let output = JSON.parse(JSON.stringify(nextProps.output));
    let data = JSON.parse(JSON.stringify(nextProps.data))

    if (0 === Object.keys(data).length) {
      data = {
        path: output.directoryPath,
        list: [],
      };

      for (let i = 0; i < output.directoryContents.length; i++) {
        let item = output.directoryContents[i];
        if (item.type === 'file') {
          if (item.name.split('.')[item.name.split('.').length - 1] === 'dat') {
            data.list.push({
              name: item.name,
              checked: item.checked,
              opened: true,
              raw: this.ShapingDat(ipcRenderer.sendSync('readDat', data.path + '\\' + item.name)),
            })
          }
        } else {
          for (let j = 0; j < item.contents.length; j++) {
            let item2 = item.contents[j];
            if (item2.name.split('.')[item2.name.split('.').length - 1] === 'dat') {
              data.list.push({
                name: item.name + '\\' + item2.name,
                checked: item2.checked,
                opened: true,
                raw: this.ShapingDat(ipcRenderer.sendSync('readDat', data.path + '\\' + item.name + '\\' + item2.name)),
              })
            }
          }
        }
      }
    }
    this.setState({ output, data });
  }

  ShapingDat(raw) {
    let tempRows = raw.split(/\r\n/)
    let tempItems = tempRows.map(row =>
      row.split(/\s+/).filter(item => item)
    )
    let results = tempItems[0].map((item, i) => {
      if (i > 0) {
        return {
          xLabel: tempItems[0][0],
          yLabel: item,
          data: [],
          display: false,
          color: "#" + Math.floor(Math.random() * Math.floor(256)).toString(16) + Math.floor(Math.random() * Math.floor(256)).toString(16) + Math.floor(Math.random() * Math.floor(256)).toString(16)
        }
      }
    }).filter(item => item);

    for (let i = 1; i < tempItems.length; i++) {
      let tempItem = tempItems[i];
      if (tempItem.length) {
        for (let j = 0; j < results.length; j++) {
          let row = results[j];
          row.data.push({
            x: tempItem[0],
            y: tempItem[j + 1],
            yLabel: results[0].yLabel,
          });
        }
      }
    }
    return results;
  }

  changeOutput(output, item) {
    let data = JSON.parse(JSON.stringify(this.state.data));
    if (item) {
      for (let i = 0; i < data.list.length; i++) {
        if (data.list[i].name === item) {
          data.list[i].checked = !data.list[i].checked;
          for (let j = 0; j < data.list[i].raw.length; j++) {
            data.list[i].raw[j].display = data.list[i].checked;
          }
        }
      }
    }
    this.setState({ output, data });
    this.props.onEventCallBack(output, data)
  }

  changeData(data, i, j) {
    this.setState({ data });
    this.props.onEventCallBack(this.state.output, data)
  }

  render() {
    const { classes } = this.props;
    const { output, data } = this.state;
    return (
      <Grid container className={classes.root}>
        <OutputList output={output} xs={3} onEventCallBack={this.changeOutput} />
        <DataList data={data} xs={3} onEventCallBack={this.changeData} />
        <ChartGrid data={data} xs={6} />
      </Grid>
    );
  }
}

OutputGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OutputGrid);
