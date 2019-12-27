import React, { Component } from 'react';
import { modelName, DataToDom } from '../config';
import { isEmpty, ceil } from 'lodash';
import { DraggableContainer, DraggableChild } from '@/components/Draggable';
import styles from './index.less';

class DraggableContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  // 画布递归渲染
  childrenDom(item) {
    return (
      <div
        style={{
          ...item.style,
          width: '100%',
          height: '100%',
          position: 'relative',
          pointerEvents: 'none',
          display: item.style.display && item.style.display,
        }}
      >
        {!isEmpty(item.children) &&
          DataToDom(item.children).map(v => {
            return (
              <div
                key={v.key}
                style={{
                  ...v.style,
                  display: v.style.display && v.style.display,
                  position: item.style.display ? '' : 'absolute',
                  top: `${v.position.y || 0}px`,
                  left: `${v.position.x || 0}px`,
                  boxSizing: 'content-box',
                  border: this.props.currentIndex === v.key && '1px solid red'
                }}
              >
                {(v.DomType !== 'div' && v.comp) || this.childrenDom(v)}
              </div>
            );
          })}
      </div>
    );
  }
  // domList(num) {
  //   let list = [];
  //   for (let a = 0; a < num; a++) {
  //     list.push(`${a}00_px`);
  //   }
  //   return list;
  // }
  render() {
    const {
      currentIndex = '',
      newConfig = [],
      containerStyle = {},
      autoHeight,
      displayFix,
    } = this.props;
    // 操作中的元素置顶
    const zIndex = { zIndex: '98' };
    return (
      <div
        style={{
          maxWidth: '100%',
          overflowY: 'auto',
          position: 'relative',
        }}
        onDrop={event => this.props.drop(event)}
        onDragOver={event => this.props.allowDrop(event)}
        onClick={() => this.props.canvasClick()}
      >
        {/* {
          <div
            style={{
              width: containerStyle.width,
              height: '30px',
              backgroundImage:
                'repeating-linear-gradient(to right, rgba(255, 255, 255, 0),rgba(249, 249, 249, 0) 4px,#000 1px ,#000 2px)',
              position: 'absolute',
              top: '0',
              left: '0',
              overflow: 'hidden'
            }}
            className={styles['ruler']}
          >
            {
              this.domList(ceil(newWidth/100)).map((v, i) => {
                return (<div key={v} className={styles['cm']} style={{left: `${i}00px`}}>
                  <div className={styles['mm']}></div>
                  <div className={styles['mm']}></div>
                  <div className={styles['mm']}></div>
                  <div className={styles['mm']}></div>
                  <div className={styles['mm']}></div>
                  <div className={styles['mm']}></div>
                  <div className={styles['mm']}></div>
                  <div className={styles['mm']}></div>
                  <div className={styles['mm']}></div>
                  </div>)
              })
            }
            
          </div>
        }
        {
          <div
            style={{
              width: '20px',
              height: containerStyle.minHeight,
              backgroundImage:
                'repeating-linear-gradient(to bottom, rgba(255, 255, 255, 0),rgba(249, 249, 249, 0) 4px,#000 1px ,#000 2px)',
              position: 'absolute',
              top: '0',
              left: '0',
            }}
          ></div>
        } */}
        <DraggableContainer
          style={containerStyle}
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
                    (currentIndex === item.key
                      ? { ...zIndex }
                      : { ...{ zIndex: item.style && item.style.zIndex || 0 } },
                    {
                      ...item.style,
                      ...{
                        overflow: item.DomType === 'div' && 'auto' || '',
                        boxSizing: 'content-box',
                        border:
                          item.DomType === 'div' &&
                          (currentIndex === item.key && currentIndex !== -1
                            ? '1px solid red'
                            : '1px dashed #ddd'),
                        position: displayFix ? '' : 'absolute',
                      },
                    })
                  }
                >
                  {(item.DomType !== 'div' && (
                    <div
                      style={{
                        ...item.style,
                        pointerEvents: 'none',
                        boxSizing: 'border-box',
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                      }}
                    >
                      {item.comp}
                      {currentIndex === item.key && currentIndex !== -1 && (
                        <React.Fragment>
                          {item.DomType !== 'div' && (
                            <React.Fragment>
                              <div className={styles['top']} />
                              <div className={styles['bottom']} />
                              <div className={styles['left']} />
                              <div className={styles['right']} />
                            </React.Fragment>
                          )}
                        </React.Fragment>
                      )}
                    </div>
                  )) ||
                    this.childrenDom(item)}
                </div>
              </DraggableChild>
            );
          })}
        </DraggableContainer>
      </div>
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
