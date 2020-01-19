import React, { Component } from 'react';
import { cloneDeep, isEmpty, isFunction } from 'lodash-es';
import { Button, Divider, Icon, Input, Select, Switch, Popconfirm } from 'antd';
import { BOM_TYPE } from '@/helpers/renderPage';

const { Option } = Select;

/**
 * editType = 'SELECT'
 * 属性下拉框选择
 * */
export class AttributeSelect extends Component {
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

/**
 * editType = 'TEXT'
 * 属性文本输入框
 * */
export class AttributeInput extends Component {
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

/**
 * editType = 'CHECKBOX'
 * 属性开关按钮 true / false
 * */
export class AttributeSwitch extends Component {
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
    const { initData, customAttributeChange, keys } = this.props;
    let newData = cloneDeep(initData);
    this.setState({
      value: e,
    }, () => {
      // 用于属性true / false 值
      if (keys !== undefined) {
        newData['attribute'] && newData['attribute'].hasOwnProperty(keys) && (newData['attribute'][keys] = e);
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

/**
 * editType = 'JSX'
 * 属性jsx模式
 * */
export class AttributeJSX extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  confirm(e) {
  }

  render() {
    const { defaultValue } = this.props;
    console.log('defaultValue', defaultValue);
    return (
      <>
        {defaultValue['$$_type'] === 'jsx' && !isEmpty(defaultValue['$$_body']) &&
        defaultValue['$$_body'].map((item, index) => {
          return (
            <div key={`${item.$$_type}_${index}`}>
              <div style={{ width: '60%', touchAction: 'none', marginBottom: '10px', display: 'inline-block' }}>
                {
                  BOM_TYPE({
                    DomType: item.$$_body.DomType,
                    name: item.$$_body.name,
                    style: item.$$_body.style,
                    attribute: item.$$_body.attribute,
                  })
                }
              </div>
              <div style={{ float: 'right' }}>
                <a>修改</a><Divider type="vertical"/>
                <Popconfirm
                  title="是否删除当前组件?"
                  onConfirm={this.confirm.bind(this)}
                  okText="Yes"
                  cancelText="No"
                >
                  <a>删除</a>
                </Popconfirm>
              </div>
            </div>
          );
        })}
        <div>
          <Button type={'dashed'} style={{ width: '100%' }} icon="plus">新增内容</Button>
        </div>
      </>
    );
  }
}
