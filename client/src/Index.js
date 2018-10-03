import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import key from 'keymaster'

import AppBar from './Components/AppBar';
import InputGrid from './Components/Input/InteractiveGrid';
import OutputGrid from './Components/Output/OutputGrid'
import Tabs from './Components/Tabs';

import { createInitialInput, convertJsontoN3, convertN3toJson, getMaxCounter, convertDatatoDat } from './Functions/Common';

const { ipcRenderer } = window.require('electron');
const remote = window.require('electron').remote;
const { dialog } = window.require('electron').remote;

const styles = theme => ({
  app: {
    height: '100%'
  },
});

class Index extends React.Component {
  constructor(props) {
    super(props);
    const { input, counter } = createInitialInput();
    this.state = {
      input: input,
      jsonfile: JSON.stringify(input),
      counter: counter,
      n3file: convertJsontoN3(input),
      mode: "output",
      output: {},
      data: {},
      outputDat: '',
    };

    this.changeFile = this.changeFile.bind(this);
    this.changeData = this.changeData.bind(this);
    this.changeOutputData = this.changeOutputData.bind(this);
    this._changeMode = this._changeMode.bind(this);
    this.keyPress = this.keyPress.bind(this);
    key('ctrl+e, ctrl+i, ctrl+o, ctrl+s, ctrl+w', (event, handler) => this.keyPress(event, handler));
  }

  changeFile(type) {
    if (type === 'inputInitialize') {
      this.setState({ ...createInitialInput() });
    } else if (type === 'outputInitialize') {
      let options = {
        title: "Open folder",
        properties: ['openDirectory']
      };
      let that = this;
      dialog.showOpenDialog(options, function (filenames) {
        ipcRenderer.send('mul-async-dialog', filenames);
        ipcRenderer.on('mul-async-dialog-replay', (event, directoryPath, directoryContents, isOutputData) => {
          that.setState({ output: { directoryPath, directoryContents }, data: [], outputDat: '' });
        });
      });
    } else if (type === 'inputUpdate') {
      let options = {
        title: "Open folder",
        properties: ['openFile'],
      };
      let that = this;
      dialog.showOpenDialog(options, function (filename) {
        if (!filename) return false;
        ipcRenderer.send('openInputFile', filename);
        ipcRenderer.on('openInputFile-replay', (event, path, content) => {
          if (path.split('.')[path.split('.').length - 1] === "json") {
            that.setState({ jsonfile: content, ...getMaxCounter(content) });
          }
          if (path.split('.')[path.split('.').length - 1] === "in") {
            that.setState({ n3file: content, ...convertN3toJson(content) });
          }
        });
      });
    } else if (type === 'outputUpdate') {
      let options = {
        title: "Open folder",
        properties: ['openFile'],
      };
      let that = this;
      dialog.showOpenDialog(options, function (filename) {
        if (!filename) return false;
        ipcRenderer.send('openInputFile', filename);
        ipcRenderer.on('openInputFile-replay', (event, path, content) => {
          let outputData = JSON.parse(content);
          that.setState({ output: outputData.output, data: outputData.data, outputDat: convertDatatoDat(outputData.data) });
        });
      });
    } else if (type === 'inputSave') {
      let options = {
        title: "Save  json input file",
        defaultPath: 'filename.json',
        filters: [
          { name: 'nextnano3', extensions: ['json'] },
        ]
      };
      let that = this;
      dialog.showSaveDialog(options, function (filename) {
        if (!filename) return false;
        ipcRenderer.send('saveInputFile', filename, that.state.jsonfile);
      });
    } else if (type === 'outputSave') {
      let options = {
        title: "Save json output file",
        defaultPath: 'outputData.json',
        filters: [
          { name: 'nextnano3', extensions: ['json'] },
        ]
      };
      let that = this;
      dialog.showSaveDialog(options, function (filename) {
        if (!filename) return false;
        ipcRenderer.send('saveInputFile', filename, JSON.stringify({ output: that.state.output, data: that.state.data }));
      });
    } else if (type === 'inputExport') {
      let options = {
        title: "Save nextnano3 input file",
        defaultPath: 'filename.in',
        filters: [
          { name: 'nextnano3', extensions: ['in'] },
        ]
      };
      let that = this;
      dialog.showSaveDialog(options, function (filename) {
        if (!filename) return false;
        ipcRenderer.send('saveInputFile', filename, that.state.n3file);
      });
    } else if (type === 'outputExport') {
      let options = {
        title: "Save dat file",
        defaultPath: 'filename.dat',
        filters: [
          { name: 'nextnano3', extensions: ['dat'] },
        ]
      };
      let that = this;
      dialog.showSaveDialog(options, function (filename) {
        if (!filename) return false;
        ipcRenderer.send('saveInputFile', filename, that.state.outputDat);
      });
    }
  }

  keyPress(event, handler) {
    let key = handler.key;
    let mode = this.state.mode;
    if (key === 'ctrl+o') {
      if (mode === 'input') {
        this.changeFile('inputInitialize');
      } else if (mode === 'output') {
        this.changeFile('outputInitialize');
      }
    } else if (key === 'ctrl+i') {
      if (mode === 'input') {
        this.changeFile('inputUpdate');
      } else if (mode === 'output') {
        this.changeFile('outputUpdate');
      }
    } else if (key === 'ctrl+s') {
      if (mode === 'input') {
        this.changeFile('inputSave');
      } else if (mode === 'output') {
        this.changeFile('outputSave');
      }
    } else if (key === 'ctrl+e') {
      if (mode === 'input') {
        this.changeFile('inputExport');
      } else if (mode === 'output') {
        this.changeFile('outputExport');
      }
    } else if (key === 'ctrl+w') {
      remote.getCurrentWindow();
      window.close();
    }

  }

  changeData(changedData, type, counter) {
    this.setState({ 
      jsonfile: changedData,
      input: JSON.parse(changedData),
      n3file: convertJsontoN3(JSON.parse(changedData)),
      counter: counter
    });
  }

  changeOutputData(output, data) {
    let outputDat = convertDatatoDat(data);
    this.setState({ output, data, outputDat });
  }

  _changeMode(mode) {
    this.setState({ mode });
  }

  render() {
    const { classes } = this.props;
    const { input, output, data, counter, mode } = this.state;
    return (
      <div className={classes.app}>
        <AppBar mode={mode} onEventCallBack={this.changeFile} changeMode={this._changeMode} />
        {mode === "input" && <InputGrid input={input} counter={counter} onEventCallBack={this.changeData} />}
        {mode === "output" && <OutputGrid output={output} data={data} onEventCallBack={this.changeOutputData} />}
        <Tabs />
      </div>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Index);