import React, { Component } from 'react';
import { Input } from 'antd';
class Jhinput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { attribute, newStyles} = this.props;
    return (
      <Input {...this.props}/>
    );
  }
}

module.exports = Jhinput;
