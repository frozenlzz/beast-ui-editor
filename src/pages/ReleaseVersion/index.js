import React, { Component } from 'react';
import { modelName } from './config';
import { DataToDom } from '../InterfaceDesign/config';
import { connect } from 'dva';
import isEmpty from 'lodash/isEmpty';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

@connect(interfaceDesign => interfaceDesign)
class ReleaseVersion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initData: [],
    };
  }

  componentDidMount() {
    const initData = localStorage.getItem('initData');
    if (initData) {
      this.setState(
        {
          initData: JSON.parse(initData),
        },
        () => {
          console.log(this.state.initData);
        },
      );
    }
  }

  // 画布递归渲染
  // childrenDom(item) {
  //   return (
  //     <div
  //       style={{
  //         ...item.style,
  //         width: '100%',
  //         height: '100%',
  //         position: 'relative',
  //         display: item.style.display && item.style.display,
  //       }}
  //     >
  //       {!isEmpty(item.children) &&
  //       DataToDom(item.children).map(v => {
  //         return (
  //           <div
  //             key={v.key}
  //             style={{
  //               ...v.style,
  //               display: v.style.display && v.style.display,
  //               position: item.style.display ? '' : 'absolute',
  //               top: `${v.position.y || 0}px`,
  //               left: `${v.position.x || 0}px`,
  //               overflow: v.DomType === 'div' && 'auto',
  //             }}
  //           >
  //             {(v.DomType !== 'div' && v.comp) || this.childrenDom(v)}
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
  // }
  childrenDom(item) {
    return (
      <>
        {!isEmpty(item.children) &&
        DataToDom(item.children).map(v => {
          return React.cloneElement(
            v.DomType === 'div' && <div>
              {
                (item.style.display &&
                  <div style={{
                    ...v.style,
                    position: v.style.display ? '' : 'absolute',
                    width: v.style.width && v.style.width,
                    height: v.style.height && v.style.height,
                  }}>
                    {this.childrenDom(v)}
                  </div>
                  || this.childrenDom(v))
              }
            </div> ||
            v.DomType === 'JhTabs' && <div>{this.JhTabsDOM(v)}</div> ||
            v.comp,
            {
              key: v.key,
              style: {
                ...v.style,
                ...{
                  position: item.style.display ? '' : 'absolute',
                  top: `${v.position.y || 0}${item.style.display ? '' : 'px'}`,
                  left: `${v.position.x || 0}${item.style.display ? '' : 'px'}`,
                  overflow: v.DomType === 'div' && 'auto',
                  border: v.DomType === 'div' && '1px solid #ccc',
                },
              },
            },
          );
        })}
      </>
    );
  }
  //页签组件画布
  JhTabsDOM(item) {
    return (
      <Tabs defaultActiveKey="0" type="card" style={{ backgroundColor: '#fff' }}>
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
                      borderWidth: '0px 1px 1px',
                      borderColor: '#e8e8e8',
                      borderStyle: 'solid',
                      marginTop: '-17px',
                    }}
                >
                  {this.childrenDom(i)}
                </div>
              </TabPane>
            );
          })
        }
      </Tabs>
    );
  }

  render() {
    const initData = !isEmpty(this.state.initData) ? DataToDom(this.state.initData) : [];
    return (
      <div style={{ position: 'relative' }}>
        {!isEmpty(initData) &&
        initData.map((item, i) => {
          return React.cloneElement(
            item.DomType === 'div' && <div>{this.childrenDom(item)}</div> ||
            item.DomType === 'JhTabs' && <div>{this.JhTabsDOM(item)}</div> ||
            item.comp,
            {
              key: i,
              style: {
                ...item.style,
                ...{
                  position: 'absolute',
                  top: `${item.position.y || 0}px`,
                  left: `${item.position.x || 0}px`,
                  overflow: item.DomType === 'div' && 'auto',
                  border: item.DomType === 'div' &&'1px solid #ccc',
                },
              },
            },
          );
        })}
      </div>
    );
  }
}

export default ReleaseVersion;
