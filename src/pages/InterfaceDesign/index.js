import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { connect } from 'dva';
import { modelName, DataToDom, randomString } from './config';
import { isEmpty, omit } from 'lodash';

import ComponentLibrary from './ComponentLibrary';
import PropertySettings from './PropertySettings';
// import { DraggableContainer, DraggableChild } from '@/componentsTpl/Draggable';
import DraggableContent from './DraggableContent';
// import styles from './index.less';

@connect(interfaceDesign => interfaceDesign)
export default class InterfaceDesign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: [], // 页面对应的对象表
      currentData: {}, // 选中的对象
      currentIndex: -1, // 选中的对象索引(默认 -1 为不选中任何对象)
    };
  }

  /**
   * @param {Object} this.props.interfaceDesign
   * */
  componentDidMount() {
    const { initData, currentIndex } = this.props.interfaceDesign;
    this.setState({
      config: initData,
      currentIndex: currentIndex,
    });
    // 用于选择项目start
    // if(this.props.location.query.id){
    //   this.objectVisibleChange(false)
    // }
    // 用于选择项目end
  }

  componentDidUpdate(oldProps) {
    if (oldProps.interfaceDesign.initData !== this.props.interfaceDesign.initData) {
      const { initData } = this.props.interfaceDesign;
      this.setState({
        config: initData,
      });
    }
    if (oldProps.interfaceDesign.currentIndex !== this.props.interfaceDesign.currentIndex) {
      const { currentIndex } = this.props.interfaceDesign;
      this.setState({
        currentIndex: currentIndex,
      });
    }
    if (this.onkeydown) {
      document.addEventListener('keydown', this.onkeydown);
    }
    // 用于选择项目start
    // if(oldProps.location.query.id !== this.props.location.query.id) {
    //   console.log('key',this.props.location.query.id)
    //   if(this.props.location.query.id){
    //     this.objectVisibleChange(false)
    //   }
    // }
    // 用于选择项目end
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onkeydown);
  }
  onkeydown = e => {
    if (e.keyCode === 46 && this.state.currentIndex !== -1) {
      const index = this.state.currentIndex;
      const _this = this;
      Modal.confirm({
        title: '确定删除元素吗?',
        centered: true,
        onOk() {
          // 删除当前选中元素
          console.log('删除当前选中元素', _this.state.currentIndex);
          _this.currentKeyChange(-1);
          _this.props.dispatch({
            type: `${modelName}/delete`,
            payload: { index: index },
          });
        },
      });
    }
  };
  objectVisibleChange(bool) {
    this.props.dispatch({
      type: `${modelName}/objectVisibleChange`,
      payload: { visible: bool },
    });
  }
  // 点击当前元素，弹起触发
  MouseUp(e, index, item) {
    e.persist();
    console.log('选中对象最新位置》》》', e.target.dataset.x, e.target.dataset.y);
    // 如果位置不发生改变，不触发更新数据事件
    if (item.position.x - e.target.dataset.x || item.position.y - e.target.dataset.y) {
      let newItem = item;
      newItem.position = { x: e.target.dataset.x, y: e.target.dataset.y };
      this.editAttribute(newItem, index);
    }
  }

  // 修改组件属性start
  editAttribute(data = {}, index) {
    this.props.dispatch({
      type: `${modelName}/editAttribute`,
      payload: { data: data, index: index },
    });
  }
  // 修改组件属性end

  // 拖拽元素模板到画布上
  drop(ev, index = '-1') {
    ev.preventDefault();
    ev.stopPropagation();
    ev.persist();
    const config = this.state.config;
    let data = ev.dataTransfer.getData('Text');
    let newData = JSON.parse(data);
    console.log(newData);
    const offsetX = newData.offsetX || 0; // 鼠标距离拖拽元素的原点x轴
    const offsetY = newData.offsetY || 0; // 鼠标距离拖拽元素的原点y轴
    newData['position'] = {}; // 元素位置
    newData.position['x'] = ev.nativeEvent.offsetX - offsetX; // 鼠标距离放置容器的原点x轴 减去 鼠标距离拖拽元素的原点x轴
    newData.position['y'] = ev.nativeEvent.offsetY - offsetY; // 鼠标距离放置容器的原点y轴 减去 鼠标距离拖拽元素的原点y轴
    newData.key = randomString();
    newData = omit(newData, ['offsetX', 'offsetY']);
    if (index === '-1') {
      this.setState(
        {
          config: [...config, newData],
          currentData: newData,
        },
        () => {
          this.props.dispatch({
            type: `${modelName}/add`,
            payload: { newObj: newData, index: -1 },
          });
          this.currentKeyChange(newData.key);
          // this.setState({
          //   currentIndex: newData.key,
          // });
        }
      );
    }
  }

  allowDrop(ev) {
    ev.persist();
    ev.preventDefault();
  }

  // 当前选中的组件对应key值
  currentKeyChange(key = -1) {
    this.props.dispatch({
      type: `${modelName}/keyChange`,
      payload: { key: key },
    });
  }

  showDetail(eOrRecord) {
    // this.setState({
    //   currentIndex: -1,
    // });
    this.currentKeyChange(-1);
    let record = {};
    if (!isEmpty(eOrRecord) && eOrRecord.id) {
      record = eOrRecord;
    }
    const { dispatch, match } = this.props;
    dispatch({
      type: `${modelName}/showDetail`,
      payload: {
        record,
        isPage: !isEmpty(match),
      },
    });
  }
  canvasClick() {
    this.currentKeyChange(-1);
    // this.setState({
    //   currentIndex: -1,
    // });
  }
  elementClick(e, item) {
    e.persist();
    e.stopPropagation();
    this.setState(
      {
        currentData: item,
        // currentIndex: item.key,
      },
      () => {
        this.currentKeyChange(item.key);
        console.log('选中对象索引》》》', item.key);
      }
    );
  }

  render() {
    const newConfig = !isEmpty(this.state.config) ? DataToDom(this.state.config) : [];
    const { currentData, currentIndex } = this.state;
    const containerStyle = {
      left: '0',
      top: '0px',
      width: '100%',
      minHeight: '100vh',
      position: 'relative',
      // border: '1px solid #ddd',
      // userSelect: 'none',
    };
    return (
      <>
        <div style={{ position: 'relative' }}>
          {/*组件栏*/}
          <ComponentLibrary interfaceDesign={this.props.interfaceDesign} />
          {/* 画布区域 */}
          <DraggableContent
            drop={this.drop.bind(this)}
            allowDrop={this.allowDrop.bind(this)}
            canvasClick={this.canvasClick.bind(this)}
            elementClick={this.elementClick.bind(this)}
            MouseUp={this.MouseUp.bind(this)}
            showDetail={this.showDetail.bind(this)}
            currentIndex={currentIndex}
            newConfig={newConfig}
            containerStyle={containerStyle}
            autoHeight={true}
          />
          {/*属性栏*/}
          {currentIndex !== -1 && (
            <PropertySettings
              currentData={currentData}
              currentIndex={currentIndex}
              showDetail={this.showDetail.bind(this)}
            />
          )}
        </div>
        {this.props.children}
      </>
    );
  }
}
