import React, { Component } from 'react';
import { Input, Radio } from 'antd';
import ChangeNumber from '@/components/ChangeNumber';
import { cloneDeep, omit } from 'lodash';
import styles from './index.less';

class FlexLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    };
  }
  componentDidMount() {
    const { initData } = this.props;
    if (initData.style) {
      this.setState({
        flexDirection: (initData.style.flexDirection && initData.style.flexDirection) || 'row',
        flexWrap: (initData.style.flexWrap && initData.style.flexWrap) || 'nowrap',
        justifyContent: (initData.style.justifyContent && initData.style.justifyContent) || 'flex-start',
        alignItems: (initData.style.alignItems && initData.style.alignItems) || 'flex-start',
      });
    }
  }
  componentDidUpdate(oldProps) {
    if (oldProps.initData !== this.props.initData) {
      const { initData } = this.props;
      if (initData.style) {
        this.setState({
          flexDirection: (initData.style.flexDirection && initData.style.flexDirection) || 'row',
          flexWrap: (initData.style.flexWrap && initData.style.flexWrap) || 'nowrap',
          justifyContent: (initData.style.justifyContent && initData.style.justifyContent) || 'flex-start',
          alignItems: (initData.style.alignItems && initData.style.alignItems) || 'flex-start',
        });
      }
    }
  }
  // 改变样式属性
  TypeChangeAfter(value, currentIndex, initData, attriName) {
    let newInitData = cloneDeep(initData);
    let style = (newInitData.style && newInitData.style) || {};
    style[attriName] = value;
    newInitData.style = style;
    this.props.editAttribute({ data: newInitData, index: currentIndex });
  }
  // 排布方向
  flexDirectionTypeChange(e, currentIndex, initData) {
    this.setState(
      {
        flexDirection: e.target.value,
      },
      () => {
        this.TypeChangeAfter(e.target.value, currentIndex, initData, 'flexDirection');
      }
    );
  }
  // 是否折行
  flexWrapTypeChange(e, currentIndex, initData) {
    this.setState(
      {
        flexWrap: e.target.value,
      },
      () => {
        this.TypeChangeAfter(e.target.value, currentIndex, initData, 'flexWrap');
      }
    );
  }
  // 对齐
  justifyContentTypeChange(e, currentIndex, initData) {
    this.setState(
      {
        justifyContent: e.target.value,
      },
      () => {
        this.TypeChangeAfter(e.target.value, currentIndex, initData, 'justifyContent');
      }
    );
  }
  // 交叉轴对齐
  alignItemsTypeChange(e, currentIndex, initData) {
    this.setState(
      {
        alignItems: e.target.value,
      },
      () => {
        this.TypeChangeAfter(e.target.value, currentIndex, initData, 'alignItems');
      }
    );
  }
  render() {
    const { flexDirection, flexWrap, justifyContent, alignItems } = this.state;
    const { currentIndex, initData } = this.props;
    return (
      <>
        <div>
          <div style={{ display: 'inline-block', width: '30%' }}>排布方向</div>
          <div style={{ display: 'inline-block', width: '70%' }}>
            <Radio.Group
              value={flexDirection}
              style={{ width: '100%' }}
              onChange={e => this.flexDirectionTypeChange(e, currentIndex, initData)}
            >
              <Radio.Button value="row" style={{ width: '50%' }}>
                横向排布
              </Radio.Button>
              <Radio.Button value="column" style={{ width: '50%' }}>
                纵向排布
              </Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div className={styles['line']}></div>
        <div>
          <div style={{ display: 'inline-block', width: '30%' }}>是否折行</div>
          <div style={{ display: 'inline-block', width: '70%' }}>
            <Radio.Group
              value={flexWrap}
              style={{ width: '100%' }}
              onChange={e => this.flexWrapTypeChange(e, currentIndex, initData)}
            >
              <Radio.Button value="nowrap" style={{ width: '50%' }}>
                不折行
              </Radio.Button>
              <Radio.Button value="wrap" style={{ width: '50%' }}>
                折行
              </Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div className={styles['line']}></div>
        <div>
          <div style={{ display: 'inline-block', width: '30%', verticalAlign: 'top' }}>对齐</div>
          <div style={{ display: 'inline-block', width: '70%' }}>
            <Radio.Group
              value={justifyContent}
              style={{ width: '100%' }}
              onChange={e => this.justifyContentTypeChange(e, currentIndex, initData)}
            >
              <Radio.Button value="flex-start" style={{ width: '50%' }}>
                左对齐
              </Radio.Button>
              <Radio.Button value="flex-end" style={{ width: '50%' }}>
                右对齐
              </Radio.Button>
              <Radio.Button value="center" style={{ width: '50%' }}>
                居中
              </Radio.Button>
              <Radio.Button value="space-between" style={{ width: '50%' }}>
                两端对齐
              </Radio.Button>
              <Radio.Button value="space-around" style={{ width: '100%' }}>
                两侧间隔对齐
              </Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div className={styles['line']}></div>
        <div>
          <div style={{ display: 'inline-block', width: '30%', verticalAlign: 'top' }}>
            交叉轴对齐
          </div>
          <div style={{ display: 'inline-block', width: '70%' }}>
            <Radio.Group
              value={alignItems}
              style={{ width: '100%' }}
              onChange={e => this.alignItemsTypeChange(e, currentIndex, initData)}
            >
              <Radio.Button value="flex-start" style={{ width: '50%' }}>
                起点对齐
              </Radio.Button>
              <Radio.Button value="flex-end" style={{ width: '50%' }}>
                终点对齐
              </Radio.Button>
              <Radio.Button value="center" style={{ width: '50%' }}>
                中点对齐
              </Radio.Button>
              <Radio.Button value="baseline" style={{ width: '50%' }}>
                基线对齐
              </Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div className={styles['line']}></div>
        <div>
          <div style={{ display: 'inline-block', width: '30%', verticalAlign: 'top' }}>
            内边距(px)
          </div>
          <div style={{ display: 'inline-block', width: '100%' }}>
            <div style={{display: 'flex', justifyContent: 'space-between' ,flexWrap: 'wrap'}}>
              <p style={{width: '25%'}}>上</p>
              <p style={{width: '25%'}}>右</p>
              <p style={{width: '25%'}}>下</p>
              <p style={{width: '25%'}}>左</p>
              <div style={{width: '25%'}}>
                <ChangeNumber
                  styleName={'paddingTop'}
                  unit={'px'}
                  objName={'style'}
                  initData={initData}
                  {...this.props}
                />
              </div>
              <div style={{width: '25%'}}>
                <ChangeNumber
                  styleName={'paddingRight'}
                  unit={'px'}
                  objName={'style'}
                  initData={initData}
                  {...this.props}
                />
              </div>
              <div style={{width: '25%'}}>
                <ChangeNumber
                  styleName={'paddingBottom'}
                  unit={'px'}
                  objName={'style'}
                  initData={initData}
                  {...this.props}
                />
              </div>
              <div style={{width: '25%'}}>
                <ChangeNumber
                  styleName={'paddingLeft'}
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
      </>
    );
  }
}

class CanvasLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layoutType: 'a',
    };
  }
  componentDidMount() {
    const { initData } = this.props;
    const newLayoutType = (initData.style && initData.style.display === 'flex' && 'b') || 'a';
    this.setState({
      layoutType: newLayoutType,
    });
  }
  componentDidUpdate(oldProps) {
    if (oldProps.initData !== this.props.initData) {
      const { initData } = this.props;
      const newLayoutType = (initData.style && initData.style.display === 'flex' && 'b') || 'a';
      this.setState({
        layoutType: newLayoutType,
      });
    }
  }
  layoutTypeChange(e, currentIndex, initData) {
    this.setState(
      {
        layoutType: e.target.value,
      },
      () => {
        const { layoutType } = this.state;
        let newInitData = cloneDeep(initData);
        let style = (newInitData.style && newInitData.style) || {};
        if (layoutType === 'a') {
          style = omit(style, ['display']);
        } else {
          style.display = 'flex';
        }
        newInitData.style = style;
        this.editAttribute({ data: newInitData, index: currentIndex });
      }
    );
  }

  // 修改组件属性start
  editAttribute({ data = {}, index }) {
    this.props.dispatch({
      type: 'interfaceDesign/editAttribute',
      payload: { data: data, index: index },
    });
  }
  render() {
    const { layoutType } = this.state;
    const { currentIndex, initData } = this.props;
    return (
      <div style={{ padding: '0 10px' }}>
        <div>
          <div style={{ display: 'inline-block', width: '30%' }}>布局类型</div>
          <div style={{ display: 'inline-block', width: '70%' }}>
            <Radio.Group
              value={layoutType}
              style={{ width: '100%' }}
              onChange={e => this.layoutTypeChange(e, currentIndex, initData)}
            >
              <Radio.Button value="a" style={{ width: '50%' }}>
                自由布局
              </Radio.Button>
              <Radio.Button value="b" style={{ width: '50%' }}>
                弹性布局
              </Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div className={styles['line']}></div>
        {layoutType === 'b' && (
          <FlexLayout {...this.props} editAttribute={obj => this.editAttribute(obj)} />
        )}
      </div>
    );
  }
}

export default CanvasLayout;
