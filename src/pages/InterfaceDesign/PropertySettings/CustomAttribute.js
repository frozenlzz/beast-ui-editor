import React, { Component } from 'react';
import { Input, Switch, Icon, Select } from 'antd';
import * as JH_DOM from 'jh-lib';
import * as indexConfig from 'jh-lib/es/indexConfig';
import { isEmpty } from 'lodash-es';

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
    this.setState({
      value: e,
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
    this.setState({
      value: e,
    });
  }

  render() {
    const { value } = this.state;
    return (
      <>
        <Input value={value} onChange={e => this.handleChange(e)}></Input>
      </>
    );
  }
}

class AttributeSwitch extends Component {
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
    this.setState({
      value: e,
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

class CustomAttribute extends Component {
  constructor(props) {
    super(props);
    this.state = {};

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
        {
          !isEmpty(newConfig) && newConfig.map((item, index) => {
            const defaultValue = initData.attribute[item.name] || item.body['defaultValue'];
            return (
              <div key={index}
                   style={{ margin: '0 10px 10px 10px', paddingBottom: '10px', borderBottom: '1px solid #ddd' }}>
                <p style={{ lineHeight: '18px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{item.body['name']}:{item.name}</span>
                  {
                    !item.body['required'] && (
                      <AttributeSwitch defaultValue={initData.attribute.hasOwnProperty(item.name)}
                                       currentIndex={currentIndex}
                                       style={{float: 'right'}}
                      ></AttributeSwitch>
                    )
                  }
                </p>
                <div>
                  {
                    item.body['editType'] === 'SELECT' && (
                      <AttributeSelect defaultValue={defaultValue}
                                       values={item.body['values']}
                                       currentIndex={currentIndex}></AttributeSelect>
                    ) ||
                    item.body['editType'] === 'CHECKBOX' && (
                      <AttributeSwitch defaultValue={defaultValue}
                                       currentIndex={currentIndex}
                      ></AttributeSwitch>
                    ) ||
                    <AttributeInput defaultValue={defaultValue}
                                    currentIndex={currentIndex}></AttributeInput>
                  }
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default CustomAttribute;
