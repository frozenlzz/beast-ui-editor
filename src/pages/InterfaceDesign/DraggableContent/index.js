import React, { Component } from 'react';
import { modelName, DataToDom } from '../config';
import { isEmpty, ceil } from 'lodash';
import { Slider } from 'antd';
import { DraggableContainer, DraggableChild } from '@/components/Draggable';
import styles from './index.less';

class DraggableContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleValue: 100,
    };
  }

  // 画布递归渲染
  childrenDom(item) {
    return (
      <>
        {!isEmpty(item.children) &&
        DataToDom(item.children).map(v => {
          return React.cloneElement(v.DomType !== 'div' && v.comp || <div>{this.childrenDom(v)}</div>, {
              style: {
                ...v.style,
                ...{
                  position: item.style.display ? '' : 'absolute',
                  top: `${item.style.display ? 0 : v.position.y}px`,
                  left: `${item.style.display ? 0 : v.position.x}px`,
                  overflow: v.DomType === 'div' && 'auto',
                  border: this.props.currentIndex === v.key && '1px solid red',
                },
              },
              key: v.key,
            },
          );
        })}
      </>
    );
  }

  scaleChange(value) {
    this.setState({
      scaleValue: value,
    });
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
    const paddingList = {
      paddingTop: '0',
      paddingRight: '0',
      paddingBottom: '0',
      paddingLeft: '0',
    };
    const { scaleValue } = this.state;
    return (
      <>
        {/*<div*/}
        {/*  style={{*/}
        {/*    overflow: 'auto',*/}
        {/*    position: 'relative',*/}
        {/*    background: '#fff',*/}
        {/*    transform: `scale(${scaleValue/100})`,*/}
        {/*  }}*/}
        {/*  onDrop={event => this.props.drop(event)}*/}
        {/*  onDragOver={event => this.props.allowDrop(event)}*/}
        {/*  onClick={() => this.props.canvasClick()}*/}
        {/*>*/}
        <DraggableContainer
          drop={this.props.drop}
          allowDrop={this.props.allowDrop}
          canvasClick={this.props.canvasClick}
          style={{ ...containerStyle, ...{ background: '#fff', transform: `scale(${scaleValue / 100})` } }}
          lineStyle={{ zIndex: '49' }}
          autoHeight={autoHeight}
        >
          {newConfig.map((item, index) => {
            const Position = {
              x: parseInt(item.position.x),
              y: parseInt(item.position.y),
            };
            return (
              <DraggableChild key={index} defaultPosition={Position}>
                <div
                  onClick={e => this.props.elementClick(e, item)}
                  onMouseUpCapture={e => this.props.MouseUp(e, item.key, item)}
                  style={
                    {
                      ...item.style,
                      ...paddingList,
                      ...{
                        overflow: item.DomType === 'div' && 'auto' || '',
                        boxSizing: 'content-box',
                        border:
                          item.DomType === 'div' &&
                          (currentIndex === item.key && currentIndex !== -1
                            ? '1px solid red'
                            : '1px dashed #ddd'),
                        position: displayFix ? '' : 'absolute',
                        zIndex: currentIndex === item.key ? zIndex : item.style && item.style.zIndex || 0,
                      },
                    }
                  }
                >
                  {React.cloneElement(item.DomType !== 'div' && item.comp || <div>{this.childrenDom(item)}</div>, {
                    style: {
                      ...item.style,
                      ...{
                        boxSizing: 'border-box',
                        pointerEvents: 'none',
                        overflow: item.DomType === 'div' && 'auto',
                        margin: '0',
                      },
                    },
                  })}
                  {currentIndex === item.key && currentIndex !== -1 && (
                    <React.Fragment>
                      {item.DomType !== 'div' && (
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
        {/*</div>*/}
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
  MouseUp: '', // 点击元素按下鼠标弹起之后触发的事件
  showDetail: '', // 编辑弹窗显示
  currentIndex: -1, // 当前点击元素的对应key值
  newConfig: [], // 当前画布的总元素数据
  containerStyle: {}, // 当前画布的样式表
  autoHeight: false, // 画布可自适应高度，可延申
  displayFix: false, // 画布是否为弹性布局画布（编辑画布时）
};
export default DraggableContent;
