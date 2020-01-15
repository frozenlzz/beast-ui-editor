import React, { Component } from 'react';
import { Input, InputNumber } from 'antd';
import { connect } from 'dva';
import { cloneDeep, isString, isNumber, isNaN, isObject } from 'lodash-es';

class ChangeNumber extends Component {
  static defaultProps = {
    styleName: '', // 对象下的单个属性名
    unit: '', // 单位
    initValue: '', // 当前数据
    objName: '', // 对应的对象名
  };
  constructor(props) {
    super(props);
    this.state = {
      value: props.initValue || '',
    };
  }
  componentDidUpdate(oldProps){
    if(oldProps.initValue !== this.props.initValue){
      this.setState({
        value: this.props.initValue
      });
    }
  }
  // 修改组件属性start
  editAttribute(data = {}) {
    const index = this.props.currentIndex;
    this.props.dispatch({
      type: 'pageData/editAttribute',
      payload: { ...data, index: index },
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
      oneStyle[styleName] = value;
      this.setState(
        {
          value: { ...this.state.value, ...oneStyle },
        },
        () => {
          let newStyle = cloneDeep(this.state.value);
          newStyle[styleName] = `${newStyle[styleName]}${unit}`;
          this.editAttribute({ style: newStyle });
        },
      );
    }
  }

  NumberChange(e) {
    const { styleName, unit } = this.props;
    const { value } = this.state;
    let obj = {};
    if (!isNumber(e) && e && e.target) {
      this.changeStyle({ styleName: styleName, unit: unit, value: e.target.value });
    } else if (isNumber(e)) {
      if (Math.abs(e - value[styleName]) === 1 || isNaN(Math.abs(e - value[styleName]))) {
        this.changeStyle({ styleName: styleName, unit: unit, value: e });
      }
      if (isObject(this.state.value)) {
        obj[styleName] = e;
      }
      this.setState({ value: { ...this.state.value, ...obj } });
    }
  }
  render() {
    const { value } = this.state;
    const { styleName } = this.props;
    return (
      <InputNumber
        min={1}
        value={isObject(value) ? value[styleName] : value}
        onBlur={this.NumberChange.bind(this)}
        onPressEnter={this.NumberChange.bind(this)}
        onChange={this.NumberChange.bind(this)}
      />
    );
  }
}
@connect(pageData => pageData)
class PropertySettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.pageData.initData[props.currentIndex].name,
      style: this.props.pageData.initData[props.currentIndex].style || {},
      position: this.props.pageData.initData[props.currentIndex].position || { x: 0, y: 0 },
      value: props.currentIndex || 0,
    };
  }

  componentDidUpdate(oldProps) {
    if (oldProps.pageData.initData !== this.props.pageData.initData || oldProps.currentIndex !== this.props.currentIndex){
      const {currentIndex} = this.props
      this.setState({
        style: this.props.pageData.initData[currentIndex].style || {},
        position: this.props.pageData.initData[currentIndex].position || { x: 0, y: 0 },
        name: this.props.pageData.initData[currentIndex].name,
        value: this.props.currentIndex,
      });
    }
  }

  // 修改名称name
  nameChange(e) {
    e.persist();
    this.setState(
      {
        name: e.target.value,
      },
      () => {
        this.editAttribute({ name: this.state.name });
      },
    );
  }

  // /**
  //  * 修改样式style
  //  * @param {String} styleName key属性名
  //  * @param {String} unit 单位，可选
  //  * @param {String} value 输入框值
  //  * */

  // changeStyle({ styleName = '', unit = '', value = '' }) {
  //   if (isString(styleName) && styleName !== '') {
  //     let oneStyle = {};
  //     oneStyle[styleName] = value;
  //     this.setState(
  //       {
  //         style: { ...this.state.style, ...oneStyle },
  //       },
  //       () => {
  //         let newStyle = cloneDeep(this.state.style);
  //         newStyle[styleName] = `${newStyle[styleName]}${unit}`;
  //         this.editAttribute({ style: newStyle });
  //       },
  //     );
  //   }
  // }

  // // 宽度改变事件
  // widthChange(e) {
  //   if (!isNumber(e) && e && e.target) {
  //     this.changeStyle({ styleName: 'width', unit: 'px', value: e.target.value });
  //   } else if (isNumber(e)) {
  //     if (
  //       Math.abs(e - this.state.style.width) === 1 ||
  //       isNaN(Math.abs(e - this.state.style.width))
  //     ) {
  //       this.changeStyle({ styleName: 'width', unit: 'px', value: e });
  //     }
  //     this.setState({ style: { ...this.state.style, ...{ width: e } } });
  //   }
  // }

  // // 高度改变事件
  // heightChange(e) {
  //   if (!isNumber(e) &&  e && e.target) {
  //     this.changeStyle({ styleName: 'height', unit: 'px', value: e.target.value });
  //   } else if (isNumber(e)) {
  //     if (
  //       Math.abs(e - this.state.style.height) === 1 ||
  //       isNaN(Math.abs(e - this.state.style.height))
  //     ) {
  //       this.changeStyle({ styleName: 'height', unit: 'px', value: e });
  //     }
  //     this.setState({ style: { ...this.state.style, ...{ height: e } } });
  //   }
  // }

  // 修改组件属性start
  editAttribute(data = {}) {
    const index = this.props.currentIndex;
    this.props.dispatch({
      type: 'pageData/editAttribute',
      payload: { ...data, index: index },
    });
  }

  // 修改组件属性end
  render() {
    const { name, style, position } = this.state;
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '200px',
          height: '100vh',
          background: '#eee',
          padding: '20px 10px',
        }}
      >
        <div>
          name: <Input value={name} onChange={this.nameChange.bind(this)} />
        </div>
        <div>
          width:{' '}
          {/* <InputNumber
            min={1}
            value={style.width}
            onBlur={this.widthChange.bind(this)}
            onPressEnter={this.widthChange.bind(this)}
            onChange={this.widthChange.bind(this)}
          /> */}
          <ChangeNumber
            styleName={'width'}
            unit={'px'}
            initValue={style}
            objName={'style'}
            {...this.props}
          />
          px
        </div>
        <div>
          height:{' '}
          {/* <InputNumber
            min={1}
            value={style.height}
            onBlur={this.heightChange.bind(this)}
            onPressEnter={this.heightChange.bind(this)}
            onChange={this.heightChange.bind(this)}
          /> */}
          <ChangeNumber
            styleName={'height'}
            unit={'px'}
            initValue={style}
            objName={'style'}
            {...this.props}
          />
          px
        </div>
        <div>x: {position.x}</div>
        <div>y: {position.y}</div>
      </div>
    );
  }
}

PropertySettings.propTypes = {};
export default PropertySettings;
