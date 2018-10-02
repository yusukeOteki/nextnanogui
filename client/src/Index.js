import React from "react";

import AppBar from './Components/AppBar';
import InputGrid from './Components/Input/InteractiveGrid';
import OutputGrid from './Components/Output/OutputGrid'
import Tabs from './Components/Tabs';

import { keywords, keywordsList } from './Components/Params';
import { createInitialInput, convertN3toJson } from './Functions/Common';

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    const initialInput = createInitialInput();
    let counter = 0;
    for (let key in initialInput) {
      for (let i = 0; i < initialInput[key].list.length; i++) {
        for (let prop in initialInput[key].list[i].properties) {
          initialInput[key].list[i].properties[prop].id = counter++;
        }
      }
    }

    this.state = {
      input: initialInput,
      jsonfile: JSON.stringify(initialInput),
      counter: counter,
      n3file: "",
      mode: "output",
      output: {},
      data: {},
    };

    this.changeFile = this.changeFile.bind(this);
    this.changeData = this.changeData.bind(this);
    this.changeOutputData = this.changeOutputData.bind(this);
    this._changeMode = this._changeMode.bind(this);
  }

  changeFile(changedfile, type) {
    if (type === "json") {
      let tempInput = JSON.parse(changedfile);
      let c = Math.max(...Object.keys(tempInput).map(key =>
        Math.max(...tempInput[key].list.map(item =>
          Math.max(...Object.keys(item.properties).map(prop =>
            item.properties[prop].id
          ))
        ))
      ))
      this.setState({ jsonfile: changedfile, input: JSON.parse(changedfile), counter: ++c });
    }
    if (type === "in") this.setState({ n3file: changedfile, input: convertN3toJson(changedfile) });
    if (type === "output") {
      this.setState({ output: changedfile.output, data: changedfile.data })
    };
  }

  changeData(changedData, type, counter) {
    if (type === "json") this.setState({ jsonfile: changedData, input: JSON.parse(changedData), counter: counter });
    if (type === "in") this.setState({ n3file: changedData });
  }

  changeOutputData(output, data) {
    this.setState({output, data});
  }

  _changeMode(mode) {
    this.setState({ mode: mode });
  }

  render() {
    const { jsonfile, n3file, input, output, data, counter, mode } = this.state;
    return (
      /*       <div>
              <ListTest />
            </div> */
      <div className="App" style={{ height: '100%' }}>
        <AppBar jsonfile={jsonfile} n3file={n3file} output={output} data={data} mode={mode} onEventCallBack={this.changeFile} changeMode={this._changeMode} />
        {mode === "input" && <InputGrid input={input} counter={counter} keywords={keywords} keywordsList={keywordsList} onEventCallBack={this.changeData} />}
        {mode === "output" && <OutputGrid output={output} data={data} counter={counter} keywords={keywords} keywordsList={keywordsList} onEventCallBack={this.changeOutputData} />}
        <Tabs />
      </div>
    )
  }
}
