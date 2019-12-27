import React, { Component } from 'react';
import { DatePicker } from 'antd';
class JhdatePicker extends Component {
  onChange(date, dateString) {
    console.log(date, dateString);
  }
  render() {
    return <DatePicker onChange={this.onChange.bind(this)} {...this.props} />;
  }
}

export default JhdatePicker;
