import React, { Component } from 'react';
import { Button, DatePicker } from 'antd';
class JhdatePicker extends Component {
  onChange(date, dateString) {
    console.log(date, dateString);
  }
  render() {
    const { attribute, style, name } = this.props;
    return <DatePicker onChange={this.onChange.bind(this)} style={style} {...attribute}/>;
  }
}

export default JhdatePicker;
