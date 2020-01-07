import React, { Component } from 'react';
import { Input, Collapse, Button } from 'antd';
import { connect } from 'dva';
import ChangeNumber from '@/components/ChangeNumber';
import { cloneDeep, isEmpty } from 'lodash';
import { getKeyToElement } from '../config';
import BasicAttribute from './BasicAttribute';
import CanvasLayout from './CanvasLayout';

const { Panel } = Collapse;

@connect(interfaceDesign => interfaceDesign)
class PropertySettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initData: getKeyToElement({
        data: props.interfaceDesign.initData,
        index: props.currentIndex,
      }),
      index: props.currentIndex || 0,
    };
  }

  componentDidUpdate(oldProps) {
    if (
      oldProps.interfaceDesign.initData !== this.props.interfaceDesign.initData ||
      oldProps.currentIndex !== this.props.currentIndex
    ) {
      this.setState({
        initData: getKeyToElement({
          data: this.props.interfaceDesign.initData,
          index: this.props.currentIndex,
        }),
        index: this.props.currentIndex,
      });
    }
  }

  // 修改名称name
  nameChange(e) {
    e.persist();
    const { index, initData } = this.state;
    let newData = cloneDeep(initData);
    newData.name = e.target.value || '';
    this.setState(
      {
        initData: newData,
      },
      () => {
        this.editAttribute({ data: newData, index: index });
      }
    );
  }

  // 修改组件属性start
  editAttribute({ data = {}, index }) {
    // const index = this.props.currentIndex;
    this.props.dispatch({
      type: 'interfaceDesign/editAttribute',
      payload: { data: data, index: index },
    });
  }

  // 修改组件属性end
  render() {
    const { initData } = this.state;
    return (
      <div
        style={{
          position: 'absolute',
          top: '0px',
          right: '0px',
          width: '280px',
          height: '100%',
          overflowY: 'auto',
          zIndex: '99',
          background: 'rgba(238, 238, 238, 0.6)',
        }}
      >
        {!isEmpty(initData) && (
          <Collapse defaultActiveKey={['1','2']}>
            <Panel header="基础属性" key="1">
              <BasicAttribute
                initData={initData || {}}
                nameChange={this.nameChange.bind(this)}
                {...this.props}
              />
            </Panel>
            <Panel header="布局" key="2" style={{ display: initData.DomType !== 'div' && 'none' }}>
              <CanvasLayout initData={initData || {}} {...this.props} />
            </Panel>
            <Panel header="高级" key="3">
              <p>高级</p>
            </Panel>
          </Collapse>
        )}
      </div>
    );
  }
}

PropertySettings.propTypes = {};
export default PropertySettings;
