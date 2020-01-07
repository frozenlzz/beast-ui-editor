import React, { Component } from 'react';
import { modelName } from './config';
import { DataToDom } from '../InterfaceDesign/config';
import { connect } from 'dva';
import isEmpty from 'lodash/isEmpty';

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
          return React.cloneElement(v.DomType !== 'div' && v.comp ||
            <div>
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
            </div>,
            {
              key: v.key,
              style: {
                ...v.style,
                ...{
                  position: item.style.display ? '' : 'absolute',
                  top: `${v.position.y || 0}${item.style.display ? '' : 'px'}`,
                  left: `${v.position.x || 0}${item.style.display ? '' : 'px'}`,
                  overflow: v.DomType === 'div' && 'auto',
                },
              },
            },
          );
        })}
      </>
    );
  }

  render() {
    const initData = !isEmpty(this.state.initData) ? DataToDom(this.state.initData) : [];
    return (
      <div style={{ position: 'relative' }}>
        {!isEmpty(initData) &&
        initData.map((item, i) => {
          return React.cloneElement(item.DomType !== 'div' && item.comp || <div>{this.childrenDom(item)}</div>, {
              key: i,
              style: {
                ...item.style,
                ...{
                  position: 'absolute',
                  top: `${item.position.y || 0}px`,
                  left: `${item.position.x || 0}px`,
                  overflow: item.DomType === 'div' && 'auto',
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
