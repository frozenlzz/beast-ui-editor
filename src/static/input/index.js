import React, { Component } from 'react';
import { Input } from 'antd';
class Jhinput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { attribute, style} = this.props;
    return (
      <Input style={{...style}} {...attribute}/>
    );
  }
}

export default Jhinput;
