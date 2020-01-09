import { Modal, Button } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { createDetail } from '@/components/HocCRUD';
import { modelName, DataToDom, randomString, getKeyToElement } from '../config';
import PageItem from '@/components/PageItem';
import { isEmpty, omit, cloneDeep } from 'lodash';
import ComponentLibrary from '../ComponentLibrary';
import PropertySettings from '../PropertySettings';
import DraggableContent from '../DraggableContent';
import styles from '@/pages/InterfaceDesign/index.less';

@connect(({ loading, interfaceDesign: { detail, isShowDetail }, interfaceDesign }) => ({
  detail,
  isShowDetail,
  loading,
  interfaceDesign,
}))
@createDetail({ modelName })
class HostDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      config: [], // 页面对应的对象表
      currentData: {}, // 选中的对象
      currentIndex: -1, // 选中的对象索引(默认 -1 为不选中任何对象)
      list: [], // 存放画布层级key的队列，用于返回上一个画布
      widthList: [], // 存放上一层以及以上的画布的width，用于计算百分比
    };
  }

  /**
   * @param {Object} this.props.interfaceDesign
   * */
  componentDidMount() {
    const { initData } = this.props.interfaceDesign;
    const { match } = this.props;
    const key = match && match.params.id;
    this.setState({
      config: getKeyToElement({ data: initData, index: key }),
      currentIndex: key,
    });
  }

  componentDidUpdate(oldProps) {
    if (
      oldProps.interfaceDesign.initData !== this.props.interfaceDesign.initData ||
      oldProps.match.params.id !== this.props.match.params.id
    ) {
      const { initData } = this.props.interfaceDesign;
      const { match } = this.props;
      const key = match && match.params.id;
      this.setState({
        config: getKeyToElement({ data: initData, index: key }),
      });
    }
    if (this.onkeydown) {
      document.addEventListener('keydown', this.onkeydown);
    }
    if (oldProps.match.params.id !== this.props.match.params.id) {
      const { match } = this.props;
      const key = match && match.params.id;
      this.setState({
        currentIndex: key,
      });
    }
    if (oldProps.interfaceDesign.currentIndex !== this.props.interfaceDesign.currentIndex) {
      const { currentIndex } = this.props.interfaceDesign;
      this.setState({
        currentIndex: currentIndex,
      });
    }
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

          _this.setState(
            {
              currentIndex: -1,
            },
            () => {
              _this.props.dispatch({
                type: `${modelName}/delete`,
                payload: { index: index },
              });
            },
          );
        },
      });
    }
  };

  // 点击当前元素，弹起触发
  MouseUp(e, index, item) {
    // e.persist();
    // console.log('选中对象最新位置》》》', e.target.dataset.x, e.target.dataset.y);
    // 如果位置不发生改变，不触发更新数据事件
    if (item.position.x - e.x || item.position.y - e.y) {
      let newItem = item;
      newItem.position = { x: e.x, y: e.y };
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
  drop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    ev.persist();
    let config = cloneDeep(this.state.config);
    let data = ev.dataTransfer.getData('Text');
    if (data) {
      let newData = JSON.parse(data);
      const offsetX = newData.offsetX || 0; // 鼠标距离拖拽元素的原点x轴
      const offsetY = newData.offsetY || 0; // 鼠标距离拖拽元素的原点y轴
      newData['position'] = {}; // 元素位置
      newData.position['x'] = ev.nativeEvent.offsetX - offsetX; // 鼠标距离放置容器的原点x轴 减去 鼠标距离拖拽元素的原点x轴
      newData.position['y'] = ev.nativeEvent.offsetY - offsetY; // 鼠标距离放置容器的原点y轴 减去 鼠标距离拖拽元素的原点y轴
      newData.key = randomString();
      newData = omit(newData, ['offsetX', 'offsetY']);
      config.children.push(newData);
      const { match } = this.props;
      const key = match && match.params.id;
      if (key) {
        this.setState(
          {
            config: config,
            currentData: newData,
          },
          () => {
            this.props.dispatch({
              type: `${modelName}/add`,
              payload: { newObj: newData, index: key },
            });
            this.setState({
              currentIndex: newData.key,
            });
          },
        );
      }
    }
  }

  allowDrop(ev) {
    ev.persist();
    ev.preventDefault();
  }

  showDetail(eOrRecord) {
    const { dispatch, match } = this.props;
    const key = match && match.params.id;
    const widthList = cloneDeep(this.state.widthList);
    const list = cloneDeep(this.state.list);
    // 将当前画布的key值存入List队列中，进入下一个画布操作
    list.push(key);
    widthList.push(this.state.config.style && this.state.config.style.width || 1920);
    this.setState({
      list: list,
      widthList: widthList,
      config: [],
    });
    let record = {};
    if (!isEmpty(eOrRecord) && eOrRecord.id) {
      record = eOrRecord;
    }
    this.canvasClick();
    dispatch({
      type: `${modelName}/showDetail`,
      payload: {
        record,
        isPage: !isEmpty(match),
      },
    });
  }
  // 当前选中的组件对应key值
  currentKeyChange(key = -1) {
    this.props.dispatch({
      type: `${modelName}/keyChange`,
      payload: { key: key },
    });
  }

  canvasClick() {
    const { match } = this.props;
    const key = match && match.params.id;
    // this.setState({
    //   currentIndex: key,
    // });
    this.currentKeyChange(key);
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
        console.log('选中对象索引》》》', this.state.currentIndex);
      },
    );
  }

  /**
   *
   * 新建保存
   */
  handleOk() {
    // console.log('this.itemRef', this.itemRef);
    const { saveDetail } = this.props;
    Modal.confirm({
      title: '确认保存信息吗?',
      centered: true,
      onOk() {
        saveDetail();
      },
    });
  }

  handleCancel(e) {
    const { dispatch, match } = this.props;
    const list = cloneDeep(this.state.list);
    const widthList = cloneDeep(this.state.widthList);
    if (!isEmpty(list)) {
      // 如果画布队列中存在画布key值，则进入上一个画布编辑，并清除画布在队列中的值
      const previouKey = list.pop();
      widthList.pop();
      const record = { id: previouKey };
      this.setState(
        {
          list: list,
          widthList: widthList,
          config: [],
        },
        () => {
          this.canvasClick();
          dispatch({
            type: `${modelName}/showDetail`,
            payload: {
              record,
              isPage: !isEmpty(match),
            },
          });
        },
      );
    } else {
      // 画布队列无值，返回最顶级画布页面
      this.props.hideDetail();
    }
  }

  // 处理宽度为像素px，%对应的输出值
  widthFn(width = '10%', maxWidth) {
    const reg = new RegExp('%', 'ig');
    console.log('当前画布宽度----------------------------', width);
    console.log('上级以上画布宽度列表widthList------------', this.state.widthList);
    console.log('浏览器窗口宽度maxWidth------------------', maxWidth);
    let newWidth = width;
    if (reg.test(width)) {
      newWidth = `${(width.replace(reg, '') / 100) * maxWidth}px`;
    }
    return newWidth;
  }

  render() {
    const { match, id, loading } = this.props;
    const isEdit = (match && match.params.id !== '') || id !== '';
    const key = match && match.params.id;
    const newAction = (
      <>
        {/* <Button onClick={this.handleOk.bind(this)} type={'primary'}>
          保存
        </Button> */}
        <Button onClick={this.handleCancel.bind(this)}>返回</Button>
      </>
    );
    const { currentData, currentIndex, config } = this.state;
    const { name, style } = (!isEmpty(config) && config) || '';
    const newConfig = !isEmpty(config) ? DataToDom(config.children) : [];
    const displayFix = !isEmpty(config) && config.style.display && config.style.display === 'flex' && true || false;
    const bodyWidth = document.body.offsetWidth;
    const containerStyle = {
      ...style,
      left: '0',
      top: '0px',
      // width: (!isEmpty(config) && config.style.width !== '100%' ? config.style.width : '1920px') || 1,
      width: (!isEmpty(config) && this.widthFn(config.style.width, bodyWidth)) || 1,
      minHeight: (!isEmpty(config) && config.style.height) || 1,
      position: 'relative',
      border: '1px solid #ddd',
      overflowY: 'auto',
      display: displayFix && 'flex' || '',
      boxSizing: 'content-box',
      // userSelect: 'none',
    };
    return (
      isEdit && (
        <>
          <PageItem
            location={this.props.location}
            title={`编辑画布---${name}`}
            visible={this.props.isShowDetail}
            onCancel={this.handleCancel.bind(this)}
            onOk={this.handleOk.bind(this)}
            style={{ background: '#333' }}
            action={newAction}
            actionPos={''}
            loading={!!loading.models[modelName]}
          >
            <div style={{ height: 'calc(100vh - 66px)' }} className={styles['pageStyle']}>
              {/*组件栏*/}
              <ComponentLibrary interfaceDesign={this.props.interfaceDesign} divKey={key}/>
              {/* 画布区域 */}
              <div style={{height: '100%', overflow: 'auto'}}>
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
                  displayFix={displayFix}
                />
              </div>
              {/*属性栏*/}
              {currentIndex !== -1 &&
              <PropertySettings
                currentData={currentData}
                currentIndex={currentIndex}
                detailId={key}
                showDetail={this.showDetail.bind(this)}
              />
              }
            </div>
          </PageItem>
        </>
      )
    );
  }
}

HostDetail.propTypes = {};

export default HostDetail;
