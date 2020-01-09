import React, { Component } from 'react';
import { Button } from 'antd';
class Jhbutton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { attribute, style, name } = this.props;
    return (
      // <>
      <Button style={style} {...attribute}>
        {name}
      </Button>
      // </>
    );
  }
}

export default Jhbutton;
