import React from 'react';
//import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import GridPaper from '../GridPaper'
import ParametersTable from './ParametersTable'

/* Table */
const styles = theme => ({
  root: {
    height:"100%"
  },
  table: {
    //minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

//let counter = 0;
function createData(id, name, value, selected, keyword, listNumber, listLength) {
  return { id, name, value, selected, keyword, listNumber, listLength };
}
class ParametersTables extends React.Component {
  constructor(props) {
    super(props);
    /* Data */
    let data = {};
    for (let i = 0; i < props.keywordsList.length; i++) {
      if (props.input[props.keywordsList[i]].selected) {
        data[props.keywordsList[i]] = [];
        for (let j = 0; j < props.input[props.keywordsList[i]].list.length; j++) {
          data[props.keywordsList[i]].push([])
          for (let prop in props.input[props.keywordsList[i]].list[j].properties) {
            data[props.keywordsList[i]][j].push(
              createData(
                props.input[props.keywordsList[i]].list[j].properties[prop].id,
                prop,
                props.input[props.keywordsList[i]].list[j].properties[prop].value,
                props.input[props.keywordsList[i]].list[j].properties[prop].selected,
                props.keywordsList[i],
                j,
                props.input[props.keywordsList[i]].list.length
              )
            )
          }
        }

      }
    }

    let selected = [];
    for (let prop in data) {
      selected[prop] = [];
      for (let i = 0; i < data[prop].length; i++) {
        for (let j = 0; j < data[prop][i].length; j++) {
          if (data[prop][i][j].selected) {
            selected[prop].push(data[prop][i][j].id)
          }
        }
      }
    }
    let list = [];
    for (let prop in data) {
      list[prop] = [];
      for (let i = 0; i < data[prop].length; i++) {
        Array.prototype.push.apply(list[prop], data[prop][i]);
      }
    }

    this.state = {
      data: data,
      selected: selected,
      list: list,
    };
    
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.changeData = this.changeData.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    //counter = 0;
    let data = {};
    const { keywordsList, input } = this.props;
    for (let i = 0; i < keywordsList.length; i++) {
      if (input[keywordsList[i]].selected) {
        data[keywordsList[i]] = [];
        for (let j = 0; j < input[keywordsList[i]].list.length; j++) {
          data[keywordsList[i]].push([])
          for (let prop in input[keywordsList[i]].list[j].properties) {
            data[keywordsList[i]][j].push(
              createData(
                input[keywordsList[i]].list[j].properties[prop].id,
                prop,
                input[keywordsList[i]].list[j].properties[prop].value,
                input[keywordsList[i]].list[j].properties[prop].selected,
                keywordsList[i],
                j,
                input[keywordsList[i]].list.length
              )
            )
          }
        }
      }
    }

    let selected = [];
    for (let prop in data) {
      selected[prop] = [];
      for (let i = 0; i < data[prop].length; i++) {
        for (let j = 0; j < data[prop][i].length; j++) {
          if (data[prop][i][j].selected) {
            selected[prop].push(data[prop][i][j].id)
          }
        }
      }
    }

    let list = [];
    for (let prop in data) {
      list[prop] = [];
      for (let i = 0; i < data[prop].length; i++) {
        Array.prototype.push.apply(list[prop], data[prop][i]);
      }
    }
    this.setState({
      data: data,
      selected: selected,
      list: list,
    });
  }

/*   shouldComponentUpdate(nextProps, nextState) {
    for(let key in nextProps){
      console.log(key, isEqual(nextProps[key], this.props[key]))
    }
    //const propsDiff = isEqual(nextProps, this.props);
    const stateDiff = isEqual(nextState, this.state);
    //console.log("propsDiff", propsDiff)
    //console.log("stateDiff", stateDiff)
    //console.log(!(propsDiff && stateDiff))
    //return !(propsDiff && stateDiff);
    return !stateDiff;
  } */

  changeData (changedItem, type) {
    let tempInput = Object.assign({}, this.props.input);
    let counter = this.props.counter;
    if (type === 'add') {
      let temp = JSON.parse(JSON.stringify(this.props.keywords[changedItem]));
      for (let prop in temp.properties) {
        temp.properties[prop].value = temp.properties[prop].default;
        temp.properties[prop].selected = temp.properties[prop].required;
        temp.properties[prop].id = counter++;
      }
      temp.properties[temp.increment].value = tempInput[changedItem].list[tempInput[changedItem].list.length - 1].properties[temp.increment].value + 1;
      temp.selected = true;
      tempInput[changedItem].list.push(temp);
    } else if(type === 'delete') {
      if(!(tempInput[changedItem.keyword].list.length<=1)){
        tempInput[changedItem.keyword].list.splice(changedItem.page, 1);
      }
    } else {
      tempInput[changedItem.keyword].list[changedItem.listNumber].properties[changedItem.name].selected = changedItem.selected;
      tempInput[changedItem.keyword].list[changedItem.listNumber].properties[changedItem.name].value = changedItem.value;
    }
    this.props.onEventCallBack(tempInput, counter);
  }

  render() {
    return (
      <GridPaper xs={this.props.xs}>
        {this.props.keywordsList.map(item => {
          if (!this.state.data[item]) {
            return ''
          } else {
            return !this.props.input[item].selected ? '' :
              <ParametersTable
                key={`${item}`}
                keyword={`${this.props.keywords[item].section}`}
                keywords={this.props.keywords}
                //input={this.props.input}
                data={this.state.data[item]}
                onEventCallBack={this.changeData}
                selected={this.state.selected[item]}
                list={this.state.list[item]}
              />
          }
        })}
      </GridPaper>
    );
  }
}

ParametersTables.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ParametersTables);
