import React, { Component } from 'react';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
function callback(key) {
  console.log(key);
}
class JhTabs extends Component {
  render() {
    const { attribute, style} = this.props;
    return (
      <Tabs defaultActiveKey="1" onChange={callback} style={{backgroundColor: '#fff', ...style}} {...attribute} type="card">
        <TabPane tab="Tab 1" key="1">
          Content of Tab Pane 1
        </TabPane>
        <TabPane tab="Tab 2" key="2">
          Content of Tab Pane 2
        </TabPane>
      </Tabs>
    );
  }
}

export default JhTabs;
