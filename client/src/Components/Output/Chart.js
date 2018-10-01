import React, { Component } from 'react';
import isEqual from 'lodash.isequal';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Label, LabelList, ReferenceLine, ReferenceArea, ResponsiveContainer } from 'recharts';

export default class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      json: [],
      ReferenceLine_display: 0,
      ReferenceLine_y: 0,
      ReferenceLine_x: 0,
      clicks: []
    }
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    /* for(let key in nextProps){
      console.log(key, isEqual(nextProps[key], this.props[key]))
    } */
    const propsDiff = isEqual(nextProps, this.props);
    const stateDiff = isEqual(nextState, this.state);
    /* console.log("propsDiff", propsDiff)
    console.log("stateDiff", stateDiff) */
    //console.log(!(propsDiff && stateDiff))
    return !(propsDiff && stateDiff);
    //return !stateDiff;
  }

  render() {
    const { json, left, right, bottom, top, refAreaLeft, refAreaRight, drag, xlabel, ylabel } = this.props;
    return (
      <ResponsiveContainer height={900 * 2 / 3} width="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 50 }}>
          <CartesianGrid />
          <XAxis dataKey={'x'} type="number" domain={[left, right]} name='xAxis'>
            <Label value={`position [nm]`} position="bottom" />
          </XAxis>
          <YAxis dataKey={'y'} type="number" domain={[bottom, top]} name='yAxis' />
          <ZAxis range={[0]} />
          {json.length && json.map((item, i) =>
            <Scatter name='compounds_scatter' key={`compound-${i}`} data={item.data} line={{ stroke: 'red', strokeWidth: 2 }} />
          )}
          {
            (refAreaLeft && refAreaRight && drag) ?
              (<ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />) : null
          }
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={this.renderTooltip} />
          <ReferenceLine y={this.state.ReferenceLine_y} stroke={this.state.ReferenceLine_y ? "black" : ""} />
          <ReferenceLine x={this.state.ReferenceLine_x} stroke={this.state.ReferenceLine_x ? "black" : ""} />
        </ScatterChart>
      </ResponsiveContainer>
    );
  }
}