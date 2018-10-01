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
    this.renderTooltip = this.renderTooltip.bind(this);
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

  // Indicating a tooltip func.
  renderTooltip(props) {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const x = payload[0];
      const y = payload[1];
      return (
        <div style={{ backgroundColor: '#fff', border: '1px solid #999', margin: 0, padding: 10 }}>
          <p>{y.payload.yLabel}: {y.value}</p>
          <p>{x.name}[nm]: {x.value}</p>
        </div>
      );
    }
  }

  render() {
    const { json, left, right, bottom, top, refAreaLeft, refAreaRight, drag, xlabel, ylabel } = this.props;
    return (
      <ResponsiveContainer height={900 * 2 / 3} width="100%">
        <ScatterChart margin={{ top: 0, right: 5, bottom: 20, left: 0 }}>
          <CartesianGrid />
          <XAxis dataKey={'x'} type="number" domain={[left, right]} name='position' unit='nm'>
            <Label value={`position [nm]`} position="bottom" />
          </XAxis>
          <YAxis dataKey={'y'} type="number" domain={[bottom, top]} name='y axis' unit='' />
          <ZAxis range={[50]} />
          {json.length && json.map((item, i) =>
            <Scatter name='chartLine' key={`compound-${i}`} data={item.data} fill={"rgba(0,0,0,0)"} line={{ stroke: item.color, strokeWidth: 1 }} />
          )}
          {
            (refAreaLeft && refAreaRight && drag) ?
              (<ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />) : null
          }
          <Tooltip cursor={{ stroke: "black", strokeDasharray: '3 3' }} content={this.renderTooltip} />
          <ReferenceLine y={this.state.ReferenceLine_y} stroke={this.state.ReferenceLine_y ? "black" : ""} />
          <ReferenceLine x={this.state.ReferenceLine_x} stroke={this.state.ReferenceLine_x ? "black" : ""} />
        </ScatterChart>
      </ResponsiveContainer>
    );
  }
}