import React, { Component } from 'react';
import { Button } from 'antd';
class Jhbutton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { attribute, newStyles, name } = this.props;
    return (
      // <>
      <Button {...this.props}>
        {name}
      </Button>
      // </>
    );
  }
}

module.exports = Jhbutton;
