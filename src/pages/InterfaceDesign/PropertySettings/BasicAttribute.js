import React, { Component } from 'react';
import { Input, Radio, Button } from 'antd';
import ChangeNumber from '@/components/ChangeNumber';
import styles from './index.less';
/**
 * 基础属性功能
 * */

class BasicAttribute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      widthType: 'a', // 基础属性中宽度类型{a：'固定', b: '自适应'}
      heightType: 'a', // 基础属性中高度类型{a：'固定', b: '自适应'}
    };
  }
  widthTypeChange(e) {
    if (e.target.value) {
      this.setState({
        widthType: e.target.value,
      });
    }
  }
  heightTypeChange(e) {
    if (e.target.value) {
      this.setState({
        heightType: e.target.value,
      });
    }
  }
  componentDidMount() {
    const { initData } = this.props;
    const regPx = new RegExp('px', 'ig');
    const regB = new RegExp('%', 'ig');
    const regvh = new RegExp('vh', 'ig');
    let [newWidth, newHeight]  = ['a', 'a'];
      console.log(initData.style.width);
      if (initData.style) {
        if (regPx.test(initData.style.width)) {
          newWidth = 'a'
        } else if (regB.test(initData.style.width)) {
          newWidth = 'b'
        }
        if (regPx.test(initData.style.height)) {
          newHeight = 'a'
        } else if (regvh.test(initData.style.height)) {
          newHeight = 'b'
        }
      }
      this.setState({
        widthType: newWidth,
        heightType: newHeight,
      });
  }
  componentDidUpdate(oldProps) {
    if (oldProps.initData !== this.props.initData) {
      const regPx = new RegExp('px', 'ig');
      const regB = new RegExp('%', 'ig');
      const regvh = new RegExp('vh', 'ig');
      const { initData } = this.props;
      let [newWidth, newHeight]  = ['a', 'a'];
      console.log(initData.style.width);
      if (initData.style) {
        if (regPx.test(initData.style.width)) {
          newWidth = 'a'
        } else if (regB.test(initData.style.width)) {
          newWidth = 'b'
        }
        if (regPx.test(initData.style.height)) {
          newHeight = 'a'
        } else if (regvh.test(initData.style.height)) {
          newHeight = 'b'
        }
      }
      this.setState({
        widthType: newWidth,
        heightType: newHeight,
      });
    }
  }
  render() {
    const { initData, detailId, currentIndex } = this.props;
    const { widthType, heightType } = this.state;
    return (
      <div style={{ padding: '0 10px' }}>
        <div>
          <div style={{ display: 'inline-block', width: '30%' }}>name</div>
          <div style={{ display: 'inline-block', width: '70%' }}>
            <Input value={initData.name} onChange={this.props.nameChange} />
          </div>
        </div>
        <div className={styles['line']}></div>
        <div style={{ marginTop: '10px' }}>
          <div>
            <div style={{ display: 'inline-block', width: '30%' }}>宽度</div>
            <div style={{ display: 'inline-block', width: '70%' }}>
              <Radio.Group
                value={widthType}
                style={{ width: '100%' }}
                onChange={e => this.widthTypeChange(e)}
              >
                <Radio.Button value="a" style={{ width: '50%' }}>
                  固定
                </Radio.Button>
                <Radio.Button value="b" style={{ width: '50%' }}>
                  自适应
                </Radio.Button>
              </Radio.Group>
            </div>
          </div>
          <div>
            <div style={{ display: 'inline-block', width: '30%' }}>
              单位({widthType === 'b' ? '%' : 'px'})
            </div>
            <div style={{ display: 'inline-block', width: '70%' }}>
              <div style={{ width: '100%' }}>
                <ChangeNumber
                  styleName={'width'}
                  unit={widthType === 'b' ? '%' : 'px'}
                  objName={'style'}
                  max={(widthType === 'b' && 100) || 999999}
                  initData={initData}
                  {...this.props}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles['line']}></div>
        <div style={{ marginTop: '10px' }}>
          <div>
            <div style={{ display: 'inline-block', width: '30%' }}>高度</div>
            <div style={{ display: 'inline-block', width: '70%' }}>
              <Radio.Group
                value={heightType}
                style={{ width: '100%' }}
                onChange={e => this.heightTypeChange(e)}
              >
                <Radio.Button value="a" style={{ width: '50%' }}>
                  固定
                </Radio.Button>
                <Radio.Button value="b" style={{ width: '50%' }}>
                  自适应
                </Radio.Button>
              </Radio.Group>
            </div>
          </div>
          <div>
            <div style={{ display: 'inline-block', width: '30%' }}>
              单位({heightType === 'b' ? 'vh' : 'px'})
            </div>
            <div style={{ display: 'inline-block', width: '70%' }}>
              <div style={{ width: '100%' }}>
                <ChangeNumber
                  styleName={'height'}
                  unit={heightType === 'b' ? 'vh' : 'px'}
                  objName={'style'}
                  max={(heightType === 'b' && 100) || 999999}
                  initData={initData}
                  {...this.props}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles['line']}></div>
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'inline-block', width: '15%' }}>left: </div>
          <div style={{ display: 'inline-block', width: '30%' }}>
            <ChangeNumber
              styleName={'x'}
              objName={'position'}
              initData={initData}
              min={0}
              {...this.props}
            />
          </div>
          <div style={{ display: 'inline-block', width: '15%', marginLeft: '10%' }}>top: </div>
          <div style={{ display: 'inline-block', width: '30%' }}>
            <ChangeNumber
              styleName={'y'}
              objName={'position'}
              initData={initData}
              min={0}
              {...this.props}
            />
          </div>
          <div className={styles['line']}></div>
          <div style={{ display: 'inline-block', width: '15%' }}>层级: </div>
          <div style={{ display: 'inline-block', width: '30%' }}>
            <ChangeNumber
              styleName={'zIndex'}
              objName={'style'}
              initData={initData}
              min={0}
              max={100}
              {...this.props}
            />
          </div>
          <div style={{ display: 'inline-block', width: '15%', marginLeft: '10%' }}>透明: </div>
          <div style={{ display: 'inline-block', width: '30%' }}>
            <ChangeNumber
              styleName={'opacity'}
              objName={'style'}
              initData={initData}
              min={0.1}
              max={1}
              step={0.1}
              {...this.props}
            />
          </div>
          <div className={styles['line']}></div>
          {initData.DomType === 'div' && detailId !== currentIndex && (
            <React.Fragment>
              <div>
                <Button
                  style={{ width: '100%' }}
                  type="primary"
                  onClick={e => {
                    e.stopPropagation();
                    this.props.showDetail({ id: currentIndex });
                  }}
                >
                  点击编辑画布内容
                </Button>
              </div>
              <div className={styles['line']}></div>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default BasicAttribute;
