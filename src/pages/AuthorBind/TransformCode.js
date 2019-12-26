import React, { Component } from 'react';
import isEmpty from 'lodash/isEmpty';

class TransformCode extends Component {

  constructor(props) {
    super(props);
    const { location } = props;
    if (!isEmpty(location.query)) {
      this.code = location.query.code;
      this.userId = location.query.userId;
      this.jumpUrl = location.query.jumpUrl;
      console.log(this.jumpUrl, this.code, this.userId);
      window.location.replace(`${this.jumpUrl}?userId=${this.userId}&code=${this.code}`);
    }
  }

  render() {
    return (<div/>);
  }
}

export default TransformCode;
