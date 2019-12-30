import React, { Component } from 'react';
import { Button, Collapse, Icon } from 'antd';
import { BOM_TYPE, getKeyToElement, modelName } from '../config';
import { isEmpty } from 'lodash';
import router from 'umi/router';
import Link from 'umi/link';
import styles from './index.less';
import PageTree from './PageTree';
import ProjectDrawer from './ProjectDrawer';
import { connect } from 'dva';

const { Panel } = Collapse;
const config = [
  {
    name: '按钮',
    DomType: 'Jhbutton',
    attribute: {
      type: 'primary',
    },
    style: {},
  },
  {
    name: '输入框',
    DomType: 'Jhinput',
    attribute: {
      placeholder: '输入框',
    },
    style: {
      width: '200px',
    },
  },
  {
    name: 'h2',
    DomType: 'h2',
    attribute: {},
    style: {
      width: '100px',
      height: 'auto',
    },
  },
  // {
  //   name: '日历',
  //   DomType: 'JhdatePicker',
  //   attribute: {
  //   },
  //   style: {},
  // },
  {
    name: '画布',
    DomType: 'div',
    attribute: {},
    style: {
      width: '100px',
      height: '100px',
    },
    children: [],
  },
];

@connect((interfaceDesign) => (interfaceDesign))
class ComponentLibrary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toSwitch: true,
    };
  }

  drag(event, data) {
    event.persist();
    data.offsetX = event.nativeEvent.offsetX || 0; // 鼠标距离拖拽元素的原点x轴
    data.offsetY = event.nativeEvent.offsetY || 0; // 鼠标距离拖拽元素的原点y轴
    event.dataTransfer.setData('Text', JSON.stringify(data));
  }

  toLink() {
    const { initData } = this.props.interfaceDesign;
    localStorage.setItem('initData', !isEmpty(initData) ? JSON.stringify(initData) : []);
  }

  toSwitch() {
    this.setState({
      toSwitch: !this.state.toSwitch,
    });
  }

  toSave() {
    const { initData } = this.props.interfaceDesign;
    console.log(initData);
  }

  projectChoose() {
    this.props.dispatch({
      type: `${modelName}/objectVisibleChange`,
      payload: { visible: true },
    });
  }

  // 撤销返回上一步操作
  revokeList() {
    this.props.dispatch({
      type: `${modelName}/revokeListChange`,
      payload: {},
    });
  }

  // 反撤销回到上一步操作
  contraryRevokeList() {
    this.props.dispatch({
      type: `${modelName}/contraryRevokeListChange`,
      payload: {},
    });
  }

  render() {
    const { toSwitch } = this.state;
    // const { divKey } = this.props;
    const { initData, revokeList, contraryRevokeList } = this.props.interfaceDesign;
    return (
      <div className={toSwitch ? styles['menu'] : styles['menuActive']}>
        <div onClick={this.toSwitch.bind(this)} className={styles['backClick']}>
          <Icon type={toSwitch ? 'left' : 'right'}/>
        </div>
        <div style={{ width: '100%', height: '100vh', overflow: 'auto ' }}>
          <Collapse defaultActiveKey={['1', '2', '3']}>
            <Panel header="菜单功能" key="1">
              <div style={{ padding: '0px 10px 10px 10px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button size="large" onClick={this.toLink.bind(this)}>
                    <Link to="/releaseVersion" target="_blank">
                      预览
                    </Link>
                  </Button>
                  {/* <Button type="primary" size="large" onClick={this.projectChoose.bind(this)}>
                  项目选择
                </Button> */}
                  <Button type="primary" size="large" onClick={this.toSave.bind(this)}>
                    保存页面
                  </Button>
                </div>
                <div className={styles['line']}></div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                  <Button type="primary"
                          disabled={isEmpty(revokeList)}
                          onClick={this.revokeList.bind(this)}>
                    <Icon type="left"/>撤销
                  </Button>
                  <Button type="primary"
                          disabled={isEmpty(contraryRevokeList)}
                          onClick={this.contraryRevokeList.bind(this)}>
                    反撤销<Icon type="right"/>
                  </Button>
                </div>
              </div>
            </Panel>
            <Panel header="组件库 (拖拽到画布)" key="2">
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {config.map((item, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        ...item.style,
                        // pointerEvents: 'none',
                        display: 'inline-block',
                        marginBottom: '10px',
                      }}
                      draggable={true}
                      onDragStart={event => this.drag(event, item)}
                    >
                      {BOM_TYPE({
                        DomType: item.DomType,
                        name: item.name,
                        style: item.style,
                        attribute: item.attribute,
                      })}
                    </div>
                  );
                })}
              </div>
            </Panel>
            <Panel header="大纲" key="3">
              {(!isEmpty(initData) && (
                <PageTree
                  initData={
                    // (divKey &&
                    //   !isEmpty(getKeyToElement({ data: initData, index: divKey })) &&
                    //   getKeyToElement({ data: initData, index: divKey }).children) ||
                    // initData
                    initData
                  }
                  config={config}
                />
              )) || (
                <div
                  style={{
                    textAlign: 'center',
                    height: '40px',
                    lineHeight: '40px',
                    color: '#bbb',
                  }}
                >
                  请开始你的画页面表演
                </div>
              )}
            </Panel>
          </Collapse>
        </div>
        {/* <ProjectDrawer /> */}
      </div>
    );
  }
}

ComponentLibrary.defaultProps = {
  divKey: '', // 当前画布的key值，用于修改子画布
};
export default ComponentLibrary;
