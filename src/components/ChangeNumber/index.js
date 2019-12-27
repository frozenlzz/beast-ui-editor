import React, { Component } from 'react';
import { InputNumber } from 'antd';
import { cloneDeep, isString, isNumber, isNaN, isObject } from 'lodash';

class ChangeNumber extends Component {
  static defaultProps = {
    styleName: '', // 对象下的单个属性名
    unit: '', // 单位
    initData: [], // 当前数据
    objName: '', // 对应的对象名
    min: 0, // 数字输入框数字范围最小值
    max: 99999, // 数字输入框数字范围最最大值
    step: 1, // 步长
  };
  constructor(props) {
    super(props);
    this.state = {
      // value: props.initValue || '',
      value: props.initData[props.objName] || {},
    };
  }
  componentDidUpdate(oldProps) {
    if (oldProps.initData !== this.props.initData) {
      this.setState({
        value: this.props.initData[this.props.objName] || {},
      });
    }
  }
  // 修改组件属性start
  editAttribute({ data = {} }) {
    const index = this.props.currentIndex;
    this.props.dispatch({
      type: 'interfaceDesign/editAttribute',
      payload: { data: data, index: index },
    });
  }

  // 修改组件属性end

  /**
   * 修改样式style
   * @param {String} styleName key属性名
   * @param {String} unit 单位，可选
   * @param {String} value 输入框值
   * */

  changeStyle({ styleName = '', unit = '', value = '' }) {
    if (isString(styleName) && styleName !== '' && isObject(this.state.value)) {
      let oneStyle = {};
      oneStyle[styleName] = `${value}${unit}`;
      this.setState(
        {
          value: { ...this.state.value, ...oneStyle },
        },
        () => {
          let newStyle = cloneDeep(this.state.value);
          let newData = cloneDeep(this.props.initData);
          newStyle[styleName] = `${(newStyle[styleName] == '0px' &&
            (styleName === 'width' || styleName === 'height') &&
            'auto') ||
            newStyle[styleName]}`;
          newData[this.props.objName] = newStyle;
          this.editAttribute({ data: newData });
        }
      );
    }
  }

  NumberChange(e) {
    const { styleName, unit } = this.props;
    const { value } = this.state;
    let obj = {};
    if (!isNumber(e) && e && e.target) {
      this.changeStyle({ styleName: styleName, unit: unit, value: e.target.value });
      if (isObject(this.state.value)) {
        obj[styleName] = `${e.target.value}${unit}`;
      }
    } else if (isNumber(e)) {
      const reg = new RegExp(this.props.unit, 'ig');
      const newNumber = isString(value[styleName])
        ? value[styleName].replace(reg, '')
        : value[styleName];
      if (
        Math.abs(e - newNumber) === 1 ||
        isNaN(Math.abs(e - newNumber)) ||
        (Math.abs(e - newNumber) < 1 && Math.abs(e - newNumber) > 0)
      ) {
        this.changeStyle({ styleName: styleName, unit: unit, value: e });
      }
      if (isObject(this.state.value)) {
        obj[styleName] = `${e}${unit}`;
      }
    }
    this.setState({ value: { ...this.state.value, ...obj } });
  }

  render() {
    const { value } = this.state;
    const { styleName, unit, min, max, step } = this.props;
    const reg = new RegExp(unit, 'ig');
    const newValue =
      isObject(value) && value
        ? isString(value[styleName])
          ? value[styleName].replace(reg, '')
          : value[styleName]
        : value;
    return (
      <InputNumber
        min={min}
        max={max}
        step={step}
        value={newValue}
        onBlur={this.NumberChange.bind(this)}
        onPressEnter={this.NumberChange.bind(this)}
        onChange={this.NumberChange.bind(this)}
        style={{ width: '100%' }}
      />
    );
  }
}
export default ChangeNumber;
