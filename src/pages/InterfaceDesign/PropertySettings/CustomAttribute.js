import React, { Component } from 'react';
import { Input, Switch, Icon, Select } from 'antd';
import { modelName } from '../config';
import { connect } from 'dva';
import * as indexConfig from 'jh-lib/es/indexConfig';
import { cloneDeep, isEmpty, omit, isFunction } from 'lodash-es';
import { BOM_TYPE } from '@/helpers/loader';

const { Option } = Select;

class AttributeSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue,
    };
  }

  componentDidUpdate(oldProps) {
    if (oldProps.currentIndex !== this.props.currentIndex) {
      this.setState({
        value: this.props.defaultValue,
      });
    }
  }

  handleChange(e) {
    const { initData, keys, customAttributeChange } = this.props;
    let newData = cloneDeep(initData);
    this.setState({
      value: e,
    }, () => {
      newData['attribute'] && newData['attribute'].hasOwnProperty(keys) && (newData['attribute'][keys] = e);
      isFunction(customAttributeChange) && customAttributeChange(newData);
    });
  }

  render() {
    const { values } = this.props;
    const { value } = this.state;
    return (
      <>
        <Select value={value} style={{ width: '100%' }} onChange={(e) => this.handleChange(e)}>
          {
            !isEmpty(values) &&
            values.map((selectItem, selectIndex) => {
              return <Option key={selectIndex} value={selectItem}>{selectItem}</Option>;
            })
          }
        </Select>
      </>
    );
  }
}

class AttributeInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue,
    };
  }

  componentDidUpdate(oldProps) {
    if (oldProps.currentIndex !== this.props.currentIndex) {
      this.setState({
        value: this.props.defaultValue,
      });
    }
  }

  handleChange(e) {
    e.persist();
    const newValue = e.target.value || '';
    this.setState({
      value: newValue,
    });
  }

  handleEnterChange(e) {
    const { initData, keys, customAttributeChange } = this.props;
    let newData = cloneDeep(initData);
    newData['attribute'] && newData['attribute'].hasOwnProperty(keys) && (newData['attribute'][keys] = this.state.value);
    isFunction(customAttributeChange) && customAttributeChange(newData);
  }

  render() {
    const { value } = this.state;
    return (
      <>
        <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} value={value}
                        onChange={e => this.handleChange(e)} onBlur={e => this.handleEnterChange(e)}></Input.TextArea>
      </>
    );
  }
}

class AttributeSwitch extends Component {
  static defaultProps = {
    attribute: '', // 当前选中属性的key
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue,
    };
  }

  componentDidUpdate(oldProps) {
    if (oldProps.currentIndex !== this.props.currentIndex) {
      this.setState({
        value: this.props.defaultValue,
      });
    }
  }

  handleChange(e) {
    const { attribute, initData, customAttributeChange, keys } = this.props;
    let newData = cloneDeep(initData);
    this.setState({
      value: e,
    }, () => {
      // 用于可传或不传的属性开关
      if (!isEmpty(attribute)) {
        if (attribute.key && attribute.hasOwnProperty('value')) {
          if (this.state.value) {
            newData['attribute'] && (newData['attribute'][attribute.key] = attribute.value);
          } else {
            newData['attribute'] && newData['attribute'].hasOwnProperty(attribute.key) && (newData['attribute'] = omit(newData['attribute'], [attribute.key]));
          }
        }
      } else {
        // 用于属性true / false 值
        if (keys !== undefined) {
          newData['attribute'] && newData['attribute'].hasOwnProperty(keys) && (newData['attribute'][keys] = e);
        }
      }
      isFunction(customAttributeChange) && customAttributeChange(newData);
    });
  }

  render() {
    const { value } = this.state;
    return (
      <>
        <Switch
          style={this.props.style || {}}
          checkedChildren={<Icon type="check"/>}
          unCheckedChildren={<Icon type="close"/>}
          checked={value}
          onChange={(e) => this.handleChange(e)}
        />
      </>
    );
  }
}

class AttributeJSX extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { defaultValue } = this.props;
    console.log('defaultValue', defaultValue);
    return (
      defaultValue['$$_type'] === 'jsx' && !isEmpty(defaultValue['$$_body']) &&
      defaultValue['$$_body'].map((item, index) => {
        return (
          <>
            <div key={`${item.$$_type}_${index}`}
                 style={{ width: '60%', touchAction: 'none', marginBottom: '10px', display: 'inline-block' }}>
              {
                BOM_TYPE({
                  DomType: item.$$_body.DomType,
                  name: item.$$_body.name,
                  style: item.$$_body.style,
                  attribute: item.$$_body.attribute,
                })
              }
            </div>
            <a href="javascript:;">修改 </a>|
            <a href="javascript:;"> 删除</a>
          </>
        );
      })
    );
  }
}

@connect()
class CustomAttribute extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  customAttributeChange(data) {
    const { currentIndex } = this.props;
    this.props.dispatch({
      type: `${modelName}/editAttribute`,
      payload: { data: data, index: currentIndex },
    });
  }

  render() {
    const { initData, currentIndex } = this.props;
    /**
     * @param {Array} newConfig 当前组件的basic属性表
     * */
    let newConfig = [];
    if (indexConfig[`${initData['DomType']}Config`] && !isEmpty(indexConfig[`${initData['DomType']}Config`]['basic'])) {
      for (let item in indexConfig[`${initData['DomType']}Config`]['basic']) {
        if (indexConfig[`${initData['DomType']}Config`]['basic'].hasOwnProperty(item)) {
          newConfig.push({
            name: item,
            body: indexConfig[`${initData['DomType']}Config`]['basic'][item],
          });
        }
      }
    }
    return (
      <div>
        <h3 style={{ textAlign: 'center', fontWeight: 'bold' }}>自定义属性</h3>
        {
          !isEmpty(newConfig) && newConfig.map((item, index) => {
            const defaultValue = initData.attribute[item.name] || item.body['defaultValue'];
            return (
              <div key={index}
                   style={{ margin: '0 10px 10px 10px', paddingBottom: '10px', borderBottom: '1px solid #ddd' }}>
                <p style={{ lineHeight: '18px' }}>
                  <span style={{ fontSize: '16px' }}>{item.body['name']}: {item.name}</span>
                  {
                    !item.body['required'] && (
                      <AttributeSwitch defaultValue={initData.attribute.hasOwnProperty(item.name)}
                                       attribute={{ key: item.name, value: item.body['defaultValue'] }}
                                       currentIndex={currentIndex}
                                       initData={initData}
                                       customAttributeChange={(e) => this.customAttributeChange(e)}
                                       style={{ float: 'right' }}
                      ></AttributeSwitch>
                    )
                  }
                </p>
                {
                  initData.attribute.hasOwnProperty(item.name) && (
                    <div>
                      {
                        item.body['editType'] === 'SELECT' && (
                          <AttributeSelect defaultValue={defaultValue}
                                           values={item.body['values']}
                                           keys={item.name}
                                           initData={initData}
                                           customAttributeChange={(e) => this.customAttributeChange(e)}
                                           currentIndex={currentIndex}></AttributeSelect>
                        ) ||
                        item.body['editType'] === 'CHECKBOX' && (
                          <AttributeSwitch defaultValue={defaultValue}
                                           keys={item.name}
                                           initData={initData}
                                           customAttributeChange={(e) => this.customAttributeChange(e)}
                                           currentIndex={currentIndex}></AttributeSwitch>
                        ) ||
                        item.body['editType'] === 'JSX' && (
                          <AttributeJSX defaultValue={defaultValue}
                                        keys={item.name}
                                        initData={initData}
                                        customAttributeChange={(e) => this.customAttributeChange(e)}
                                        currentIndex={currentIndex}></AttributeJSX>
                        ) ||
                        <AttributeInput defaultValue={defaultValue}
                                        keys={item.name}
                                        initData={initData}
                                        customAttributeChange={(e) => this.customAttributeChange(e)}
                                        currentIndex={currentIndex}></AttributeInput>
                      }
                    </div>
                  )
                }
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default CustomAttribute;
