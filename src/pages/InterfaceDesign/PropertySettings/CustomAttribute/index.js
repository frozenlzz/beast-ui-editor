import React, { Component } from 'react';
import { Checkbox, Menu, Dropdown, Icon } from 'antd';
import { modelName } from '../../config';
import { connect } from 'dva';
import * as indexConfig from 'jh-lib/es/indexConfig';
import { cloneDeep, isEmpty, omit, isFunction } from 'lodash-es';
import { AttributeSelect, AttributeInput, AttributeSwitch, AttributeJSX } from './EditorTemplate';

/**
 * 属性开关，是否需要传递该属性
 * */
class AttributeCheckbox extends Component {
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

  onChange(e) {
    const { attribute, initData, customAttributeChange } = this.props;
    let newData = cloneDeep(initData);
    this.setState({
      value: e.target.checked,
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
      }
      isFunction(customAttributeChange) && customAttributeChange(newData);
    });
  }

  render() {
    const { value } = this.state;
    return (
      <Checkbox checked={value} onChange={this.onChange.bind(this)}>
        {this.props.children}
      </Checkbox>
    );
  }
}

/**
 *
 * 类型切换菜单
 */
class TypeSwitchingMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          默认
        </Menu.Item>
        <Menu.Item>
          组件component
        </Menu.Item>
        <Menu.Item>
          绑定变量binding
        </Menu.Item>
        <Menu.Item>
          组件jsx
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu}>
        <div style={{ transform: 'rotate(90deg)', display: 'inline-block', cursor: 'pointer' }}>
          <Icon type="dash"/>
        </div>
      </Dropdown>
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
                <div style={{ lineHeight: '18px', padding: '10px 0' }}>
                  {
                    !item.body['required'] && (
                      <AttributeCheckbox defaultValue={initData.attribute.hasOwnProperty(item.name)}
                                         attribute={{ key: item.name, value: item.body['defaultValue'] }}
                                         currentIndex={currentIndex}
                                         initData={initData}
                                         customAttributeChange={(e) => this.customAttributeChange(e)}>
                        <span style={{ fontSize: '16px' }}>{item.body['name']}: {item.name}</span>
                      </AttributeCheckbox>
                    ) || (<span style={{ fontSize: '16px' }}>{item.body['name']}: {item.name}</span>)
                  }
                  <div style={{ float: 'right' }}>
                    <TypeSwitchingMenu ></TypeSwitchingMenu>
                  </div>
                </div>
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
