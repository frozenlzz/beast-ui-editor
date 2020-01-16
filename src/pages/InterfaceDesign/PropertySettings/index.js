import React, { Component } from 'react';
import { Input, Collapse, Button, Icon } from 'antd';
import { connect } from 'dva';
import ChangeNumber from '@/components/ChangeNumber';
import { cloneDeep, isEmpty } from 'lodash-es';
import { getKeyToElement } from '../config';
import BasicAttribute from './BasicAttribute';
import CanvasLayout from './CanvasLayout';
import CustomAttribute from './CustomAttribute';
import { DraggableCore } from 'react-draggable';

const { Panel } = Collapse;

class DragFixed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      y: 0, // 属性面板Top
      x: 1340, // 属性面板Left
    };
    this.lastX = null;
    this.lastY = null;
  }

  handleStart = (ev, b) => {
    ev.stopPropagation();
    const { x, y } = this.state;
    this.lastX = b.lastX - x;
    this.lastY = b.lastY - y;
  };

  handleDrag = (ev, b) => {
    ev.stopPropagation();
    const dragX = b.lastX - this.lastX;
    const dragY = b.lastY - this.lastY;
    this.setState({ x: dragX, y: dragY });
  };

  handleStop = (ev, b) => {
    ev.stopPropagation();
  };

  render() {
    const { x, y } = this.state;
    const { initData, currentIndex } = this.props;
    return (
      <DraggableCore
        grid={[1, 1]}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
        onStart={this.handleStart}
        position={{ x, y }}
      >
        <div style={{
          position: 'fixed',
          top: y,
          left: x,
          background: '#fff',
          width: '300px',
          zIndex: '9999',
          boxShadow: 'rgba(0, 0, 0, 0.2) -2px 0px 5px 0px',
        }}>
          <div
            style={{
              minHeight: '20px',
              position: 'relative',
              padding: '0 10px',
              height: '22px',
              backgroundColor: 'rgb(60,72,82)',
              cursor: 'move',
            }}
          >
            <span style={{ color: '#fff', touchAction: 'none' }}><Icon type="menu"/></span>
          </div>
          <div style={{ padding: '10px 0', minHeight: '500px', maxHeight: '600px', overflowY: 'auto' }}
               onMouseDown={e => e.stopPropagation()}>
            <CustomAttribute initData={initData || {}} currentIndex={currentIndex}/>
          </div>
        </div>
      </DraggableCore>
    );
  }
}

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
      PropertiesPanelVisible: props.interfaceDesign.PropertiesPanelVisible,
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
    if (oldProps.interfaceDesign.PropertiesPanelVisible !== this.props.interfaceDesign.PropertiesPanelVisible) {
      this.setState({
        PropertiesPanelVisible: this.props.interfaceDesign.PropertiesPanelVisible,
      });
    }
  }

  // 修改名称name
  nameChange(e, attrName = '') {
    e.persist();
    const { index, initData } = this.state;
    let newData = cloneDeep(initData);
    if (attrName) {
      newData[attrName] = e.target.value || '';
      this.setState(
        {
          initData: newData,
        },
        () => {
          this.editAttribute({ data: newData, index: index });
        },
      );
    } else {
      console.log('没有属性名');
    }
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
    const { initData, index, PropertiesPanelVisible } = this.state;
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
          <>
            <Collapse defaultActiveKey={['1', '2']}>
              <Panel header="基础属性" key="1">
                <BasicAttribute
                  initData={initData || {}}
                  nameChange={this.nameChange.bind(this)}
                  {...this.props}
                />
              </Panel>
              <Panel header="布局" key="2" style={{ display: initData.DomType !== 'div' && 'none' }}>
                <CanvasLayout initData={initData || {}} currentIndex={index}/>
              </Panel>
              <Panel header="高级" key="3">
                <p>高级</p>
              </Panel>
            </Collapse>
            {
              initData.DomType !== 'div' && initData.DomType !== 'JhTabs' && PropertiesPanelVisible && (
                <DragFixed initData={initData || {}} currentIndex={index}></DragFixed>
              )
            }
          </>
        )}
      </div>
    );
  }
}

PropertySettings.propTypes = {};
export default PropertySettings;
