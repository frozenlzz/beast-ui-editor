import React, { Component } from 'react';
import { modelName } from '../config';
import { DataToDom } from '@/helpers/renderPage';
import { isEmpty, ceil } from 'lodash-es';
import { Slider } from 'antd';
import { DraggableContainer, DraggableChild } from '@/components/Draggable';
import { Tabs } from 'antd';

const { TabPane } = Tabs;
import styles from './index.less';

const paddingList = {
  paddingTop: '0',
  paddingRight: '0',
  paddingBottom: '0',
  paddingLeft: '0',
};
const marginList = {
  marginTop: '0',
  marginRight: '0',
  marginBottom: '0',
  marginLeft: '0',
};

class DraggableContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleValue: 100, // 页面缩放百分比
    };
  }

  scaleChange(value) {
    this.setState({
      scaleValue: value,
    });
  }

  //画布递归渲染,可拖拽编辑
  draggableContainers({ item, position }) {
    const { currentIndex } = this.props;
    return (
      item.style.display ? (
        !isEmpty(item.children) &&
        DataToDom(item.children).map((i, j) => {
          return (
            <div
              key={j}
              onClick={e => this.props.elementClick(e, i)}
              style={{
                width: i.style.width || '',
                height: i.style.height || '',
              }}
            >
              {
                i.DomType === 'div' &&
                <div style={{
                  ...i.style,
                  border:
                    (currentIndex === i.key && currentIndex !== -1
                      ? '1px solid #f5222d'
                      : i.style.border ? i.style.border : '1px solid #ddd'),
                }}>
                  {this.draggableContainers({
                    item: i,
                    position: 'relative',
                  })}
                </div> ||
                React.cloneElement(i.comp, {
                  style: {
                    ...i.style,
                    ...{
                      boxSizing: 'border-box',
                      pointerEvents: 'none',
                      position: 'relative',
                      width: '100%',
                      border:
                        (currentIndex === i.key && currentIndex !== -1
                          ? '1px solid #f5222d'
                          : i.style.border ? i.style.border : ''),
                    },
                  },
                })
              }
            </div>
          );
        })) : (
        <DraggableContainer
          style={{
            ...item.style,
            position: position === 'relative' ? 'relative' : 'absolute',
            top: `0px`,
            left: `0px`,
            width: '100%',
            height: '100%',
            overflow: 'auto',
          }}
          keys={item.key}
          drop={this.props.drop}
          allowDrop={this.props.allowDrop}
          canvasClick={this.props.canvasClick}
          autoHeight={true}
          lineStyle={{ zIndex: '49' }}
        >
          {
            !isEmpty(item.children) &&
            DataToDom(item.children).map((i, j) => {
              const PositionI = {
                x: parseInt(i.position.x),
                y: parseInt(i.position.y),
              };
              return (
                <DraggableChild key={`_${j}`}
                                defaultPosition={PositionI}
                                onClick={e => this.props.elementClick(e, i)}
                                onDoubleClick={e => this.props.elementDblClick(e, i)}
                                onMouseUpCapture={e => this.props.MouseUp(e, i.key, i)}>
                  <div
                    style={{
                      ...i.style,
                      ...!i.style.display && paddingList,
                      zIndex: currentIndex === i.key ? '98' : i.style && i.style.zIndex || 0,
                      overflow: i.DomType === 'div' && 'auto' || '',
                      position: 'absolute',
                      boxSizing: 'border-box',
                      border:
                        (i.DomType === 'div' || i.style.display) &&
                        (currentIndex === i.key && currentIndex !== -1
                          ? '1px solid #f5222d'
                          : '1px solid #ddd'),
                    }}
                  >
                    {
                      i.DomType === 'div' && this.draggableContainers({ item: i }) ||
                      i.DomType === 'JhTabs' && this.JhTabsDOM({ item: i }) ||
                      React.cloneElement(i.comp, {
                        style: {
                          ...i.style,
                          ...{
                            boxSizing: 'border-box',
                            pointerEvents: 'none',
                            position: 'relative',
                            width: '100%',
                          },
                          ...marginList,
                        },
                      })
                    }
                    {currentIndex === i.key && currentIndex !== -1 && (
                      <React.Fragment>
                        {i.DomType !== 'div' && (
                          <React.Fragment>
                            <div className={styles['top']}/>
                            <div className={styles['bottom']}/>
                            <div className={styles['left']}/>
                            <div className={styles['right']}/>
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    )}
                  </div>
                </DraggableChild>
              );
            })
          }
        </DraggableContainer>)
    );
  }

  //页签组件画布
  JhTabsDOM({ item }) {
    const _this = this;

    function callback(key) {
      new Promise((resolve) =>{
        resolve();
      }).then(()=>{
        _this.props.currentKeyChange(key);
      });
    }

    const { currentIndex } = this.props;
    return (
      <Tabs defaultActiveKey="0" type="card" style={{ backgroundColor: '#fff' }} onTabClick={callback}>
        {
          !isEmpty(item.children) && item.children.map((i, j) => {
            return (
              <TabPane tab={i.name} key={i.key}>
                <div
                  style={
                    {
                      ...i.style,
                      width: '100%',
                      minHeight: '300px',
                      position: 'relative',
                      boxSizing: 'border-box',
                      ...currentIndex === i.key && currentIndex !== -1 && { border: '1px solid #f5222d' }
                      || {
                        borderWidth: '0px 1px 1px',
                        borderColor: '#e8e8e8',
                        borderStyle: 'solid',
                      },
                      marginTop: '-17px',
                      zIndex: currentIndex === i.key ? '98' : i.style && i.style.zIndex || 0,
                    }}
                  onClick={e => this.props.elementClick(e, i)}
                >
                  {this.draggableContainers({ item: i })}
                </div>
              </TabPane>
            );
          })
        }
      </Tabs>
    );
  }

  render() {
    const {
      currentIndex = '',
      newConfig = [],
      containerStyle = {},
      autoHeight,
      displayFix,
    } = this.props;
    // 操作中的元素置顶
    const zIndex = '98';
    const { scaleValue } = this.state;
    return (
      <>
        <DraggableContainer
          drop={this.props.drop}
          allowDrop={this.props.allowDrop}
          canvasClick={this.props.canvasClick}
          style={{
            ...containerStyle, ...{
              background: '#fff',
              transform: `scale(${scaleValue / 100})`,
              boxShadow: 'rgb(221, 221, 221) 0px 0px 24px',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 'auto',
              marginBottom: 'auto',
            },
          }}
          keys={'-1'}
          lineStyle={{ zIndex: '49' }}
          autoHeight={autoHeight}
        >
          {newConfig.map((item, index) => {
            const Position = {
              x: parseInt(item.position.x),
              y: parseInt(item.position.y),
            };
            return (
              <DraggableChild key={index}
                              defaultPosition={Position}
                              onClick={e => this.props.elementClick(e, item)}
                              onDoubleClick={e => this.props.elementDblClick(e, item)}
                              onMouseUpCapture={e => this.props.MouseUp(e, item.key, item)}>
                <div
                  style={
                    {
                      ...item.style,
                      ...!item.style.display && paddingList,
                      ...{
                        overflow: item.DomType === 'div' && 'auto' || '',
                        boxSizing: 'border-box',
                        border:
                          (item.DomType === 'div' || displayFix) &&
                          (currentIndex === item.key && currentIndex !== -1
                            ? '1px solid #f5222d'
                            : displayFix ? '' : '1px solid #ddd'),
                        position: displayFix ? '' : 'absolute',
                        zIndex: currentIndex === item.key ? zIndex : item.style && item.style.zIndex || 0,
                      },
                    }
                  }
                >
                  {
                    item.DomType === 'div' && this.draggableContainers({ item }) ||
                    item.DomType === 'JhTabs' && this.JhTabsDOM({ item }) ||
                    React.cloneElement(item.comp, {
                      style: {
                        ...item.style,
                        ...{
                          boxSizing: 'border-box',
                          pointerEvents: 'none',
                          position: 'relative',
                          width: '100%',
                        },
                        ...marginList,
                      },
                    })
                  }
                  {currentIndex === item.key && currentIndex !== -1 && (
                    <React.Fragment>
                      {item.DomType !== 'div' && !displayFix && (
                        <React.Fragment>
                          <div className={styles['top']}/>
                          <div className={styles['bottom']}/>
                          <div className={styles['left']}/>
                          <div className={styles['right']}/>
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  )}
                </div>
              </DraggableChild>
            );
          })}
        </DraggableContainer>
        <div style={{ position: 'fixed', bottom: '0', right: '300px', width: '200px', zIndex: '100' }}>
          <Slider tipFormatter={value => `${value}%`}
                  min={50}
                  step={5}
                  value={scaleValue}
                  onChange={this.scaleChange.bind(this)}/>
        </div>
      </>
    );
  }
}

DraggableContent.defaultProps = {
  drop: '', //拖拽事件，拖拽元素模板到画布上
  allowDrop: '', //拖拽到画布上触发的事件
  canvasClick: '', // 点击画布时触发的事件
  elementClick: '', // 点击元素时触发的事件
  elementDblClick: '', // 双击元素时触发的事件
  MouseUp: '', // 点击元素按下鼠标弹起之后触发的事件
  showDetail: '', // 编辑弹窗显示
  currentIndex: -1, // 当前点击元素的对应key值
  newConfig: [], // 当前画布的总元素数据
  containerStyle: {}, // 当前画布的样式表
  autoHeight: false, // 画布可自适应高度，可延申
  displayFix: false, // 画布是否为弹性布局画布（编辑画布时）
  currentKeyChange: null, // 切换当前选中的组件key
};
export default DraggableContent;
