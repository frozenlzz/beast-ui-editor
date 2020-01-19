import React, { Component } from 'react';
import { Input, Radio, Button, Icon } from 'antd';
import ChangeNumber from '@/components/ChangeNumber';
import { connect } from 'dva';
import styles from './index.less';
import { modelName, randomString } from '@/pages/InterfaceDesign/config';
import { cloneDeep, isEmpty } from 'lodash-es';

const { TextArea } = Input;

/**
 * 基础属性功能
 * */
@connect()
class CustomizeStyleText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.ObjectToString(props.style),
    };
  }

  componentDidUpdate(oldProps) {
    if (oldProps.style !== this.props.style) {
      this.setState({
        value: this.ObjectToString(this.props.style),
      });
    }
  }

  // 将样式对象转换为字符串{width: '100px'} => 'width:100px;'
  ObjectToString(e) {
    let newStrings = '';
    if (!isEmpty(e)) {
      for (let i in e) {
        if (e.hasOwnProperty(i)) {
          let data = [];
          data.push(i);
          data.push(e[i] + ';' + '\n');
          newStrings += data.join(':');
        }
      }
    }
    return newStrings;
  }

  handleChange(e) {
    this.setState({
      value: e.target.value,
    });
  }

  handleBlurChange(e) {
    let value = e.target.value;
    let initData = cloneDeep(this.props.initData);
    let newObjectStyle = {};
    if (value !== '') {
      let newArray;
      newArray = value.split(';');
      if (!isEmpty(newArray)) {
        newArray.forEach((item, index) => {
          // 将样式字符串转换为可存储对象类型格式
          if (item.indexOf(':') !== -1) {
            let newAttribute;
            newAttribute = item.split(':');
            newObjectStyle[newAttribute[0].replace(/[\r\n]/g, '')] = newAttribute[1].replace(/[\r\n]/g, '');
          }
        });
      }
    }
    initData.style = { ...newObjectStyle };
    this.props.dispatch({
      type: `${modelName}/editAttribute`,
      payload: { data: initData, index: this.props.currentIndex },
    });
  }

  render() {
    const { value } = this.state;
    return (
      <div>
        <div>自定义样式style(格式:"width:100px;")</div>
        <div>
          <TextArea value={value}
                    autoSize={{ minRows: 4, maxRows: 8 }}
                    onChange={e => this.handleChange(e)}
                    onBlur={e => this.handleBlurChange(e)}
          ></TextArea>
        </div>
      </div>
    );
  }
}

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
    let [newWidth, newHeight] = ['a', 'a'];
    if (initData.style) {
      if (regPx.test(initData.style.width)) {
        newWidth = 'a';
      } else if (regB.test(initData.style.width)) {
        newWidth = 'b';
      }
      if (regPx.test(initData.style.height)) {
        newHeight = 'a';
      } else if (regvh.test(initData.style.height)) {
        newHeight = 'b';
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
      let [newWidth, newHeight] = ['a', 'a'];
      // console.log(initData.style.width);
      if (initData.style) {
        if (regPx.test(initData.style.width)) {
          newWidth = 'a';
        } else if (regB.test(initData.style.width)) {
          newWidth = 'b';
        }
        if (regPx.test(initData.style.height)) {
          newHeight = 'a';
        } else if (regvh.test(initData.style.height)) {
          newHeight = 'b';
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
            <Input value={initData.name} onChange={e => this.props.nameChange(e, 'name')}/>
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
          <div style={{ display: 'inline-block', width: '15%' }}>left:</div>
          <div style={{ display: 'inline-block', width: '30%' }}>
            <ChangeNumber
              styleName={'x'}
              objName={'position'}
              initData={initData}
              min={0}
              {...this.props}
            />
          </div>
          <div style={{ display: 'inline-block', width: '15%', marginLeft: '10%' }}>top:</div>
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
          <div style={{ display: 'inline-block', width: '15%' }}>层级:</div>
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
          <div style={{ display: 'inline-block', width: '15%', marginLeft: '10%' }}>透明:</div>
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
          <div>
            <div style={{ display: 'inline-block', width: '100%', verticalAlign: 'top' }}>
              外边距-margin(px)
            </div>
            <div style={{ display: 'inline-block', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <p style={{ width: '25%' }}>上</p>
                <p style={{ width: '25%' }}>右</p>
                <p style={{ width: '25%' }}>下</p>
                <p style={{ width: '25%' }}>左</p>
                <div style={{ width: '25%' }}>
                  <ChangeNumber
                    styleName={'marginTop'}
                    min={-999}
                    unit={'px'}
                    objName={'style'}
                    initData={initData}
                    {...this.props}
                  />
                </div>
                <div style={{ width: '25%' }}>
                  <ChangeNumber
                    styleName={'marginRight'}
                    min={-999}
                    unit={'px'}
                    objName={'style'}
                    initData={initData}
                    {...this.props}
                  />
                </div>
                <div style={{ width: '25%' }}>
                  <ChangeNumber
                    styleName={'marginBottom'}
                    min={-999}
                    unit={'px'}
                    objName={'style'}
                    initData={initData}
                    {...this.props}
                  />
                </div>
                <div style={{ width: '25%' }}>
                  <ChangeNumber
                    styleName={'marginLeft'}
                    min={-999}
                    unit={'px'}
                    objName={'style'}
                    initData={initData}
                    {...this.props}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles['line']}></div>
          <div>
            <CustomizeStyleText style={initData.style} currentIndex={currentIndex}
                                initData={initData}></CustomizeStyleText>
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
          {
            initData.DomType === 'JhTabs' && (
              <React.Fragment>
                <div>
                  <Button
                    style={{ width: '100%' }}
                    type="primary"
                    onClick={e => {
                      const newData = {
                        name: '页签画布',
                        DomType: 'div',
                        position: { x: 0, y: 0 },
                        attribute: {},
                        key: randomString(),
                        style: {
                          width: '100%',
                          height: '300px',
                        },
                        children: [],
                      };
                      this.props.dispatch({
                        type: `${modelName}/add`,
                        payload: {
                          newObj: newData,
                          index: currentIndex === '-1' || currentIndex === -1 ? -1 : currentIndex,
                        },
                      });
                    }}
                  >
                    <Icon type="plus"/> 添加页签项
                  </Button>
                </div>
                <div className={styles['line']}></div>
              </React.Fragment>
            )
          }
        </div>
      </div>
    );
  }
}

export default BasicAttribute;
