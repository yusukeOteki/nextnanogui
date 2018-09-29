import React from "react";

const { ipcRenderer } = window.require('electron');
const { dialog } = window.require('electron').remote;
let that;
export default class ListTest extends React.Component {
  
  constructor(props) {
    super(props);
    that = this;
    this.state = {
      directoryPath: '',
      directoryContents: [],
      src: ""
    }
  }

  getReadASync() {
    ipcRenderer.send('mul-async');
    ipcRenderer.on('mul-async-replay', (event, arg) => {
      that.setState({ src: arg })
    });
  }

  openDialog() {
    let options = {
      title: "Open folder",
      properties: ['openDirectory']
    };
    dialog.showOpenDialog(options, function (filenames) {
      ipcRenderer.send('mul-async-dialog', filenames);
      ipcRenderer.on('mul-async-dialog-replay', (event, directoryPath, directoryContents) => {
        let src = directoryPath + "/" + directoryContents[0];
        that.setState({ directoryPath, directoryContents, src })
      });
    });
  }

  render() {
    return (
      <div>
        <input type="button" value="open" onClick={this.openDialog} />
        <ul>
          {this.state.directoryContents.map((item, i) => {
            if(typeof item === 'object'){
              return [<li key={`file-${i}`}>{`${item.name}`}</li>,
                <ul key={`file-${i}-ul`}>
                  {item.contents.map((content, j) => {
                    return <li key={`file-${i}-${j}`}>{`${content}`}</li>
                  })}
                </ul>
              ]
            }else{
              return <li key={`file-${i}`}>{`${item}`}</li>
            }
          })}
        </ul>
        <div id="imgArea">
          <img id="info2" width="800" height="550" src={this.state.src} onClick={this.getReadASync} />
        </div>
      </div>
    )
  }
}
