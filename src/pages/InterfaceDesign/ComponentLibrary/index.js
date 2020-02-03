import React, { Component } from 'react';
import { Button, Collapse, Icon, Popover, Input } from 'antd';
import { getKeyToElement, modelName, randomString } from '../config';
import { BOM_TYPE } from '@/helpers/renderPage';
import { isEmpty } from 'lodash-es';
import router from 'umi/router';
import Link from 'umi/link';
import styles from './index.less';
import PageTree from './PageTree';
import ProjectDrawer from './ProjectDrawer';
import { connect } from 'dva';
import * as JH_DOM from 'jh-lib';
import * as indexConfig from 'jh-lib/es/indexConfig';

const { Search } = Input;
const { Panel } = Collapse;
let newJH_DOM = [];
for (let JH_item in JH_DOM) {
  if (JH_item !== 'PROP_TYPES') {
    let newConfig = {};
    /**
     * @param item
     * 将默认属性添加到对应的设计器组件中
     * */
    if (indexConfig[`${JH_item}Config`] && !isEmpty(indexConfig[`${JH_item}Config`]['basic'])) {
      for (let item in indexConfig[`${JH_item}Config`]['basic']) {
        if (indexConfig[`${JH_item}Config`]['basic'].hasOwnProperty(item)) {
          newConfig[item] = indexConfig[`${JH_item}Config`]['basic'][item].defaultValue || '';
        }
      }
    }
    newJH_DOM.push(
      {
        name: JH_item,
        DomType: JH_item,
        attribute: {
          ...newConfig,
        },
        style: {},
      },
    );
  }
}
const config = [
  ...newJH_DOM,
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
  {
    name: '页签',
    DomType: 'JhTabs',
    attribute: {},
    style: {
      width: '500px',
      height: 'auto',
    },
    children: [
      {
        name: '标签画布1',
        DomType: 'div',
        position: { x: 0, y: 0 },
        attribute: {},
        key: randomString(),
        style: {
          width: '100%',
          height: '300px',
        },
        children: [],
      },
    ],
  },
];

@connect((interfaceDesign) => (interfaceDesign))
class ComponentLibrary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toSwitch: true,
      assemblySearchValue: '', // 组件搜索关键字
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

  // 组件快速搜索
  assemblySearch(value) {
    this.setState({
      assemblySearchValue: value,
    });
  }

  render() {
    const { toSwitch, assemblySearchValue } = this.state;
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
                  <Button.Group>
                    <Button disabled={isEmpty(revokeList)}
                            onClick={this.revokeList.bind(this)}
                            title={'撤销'}
                            style={{ marginRight: '10px' }}>
                      <Icon type="undo"/>
                    </Button>
                    <Button disabled={isEmpty(contraryRevokeList)}
                            onClick={this.contraryRevokeList.bind(this)}
                            title={'反撤销'}>
                      <Icon type="redo"/>
                    </Button>
                  </Button.Group>
                </div>
                <div className={styles['line']}></div>
              </div>
            </Panel>
            <Panel header={`组件库 (拖拽到画布)`} key="2">
              <div style={{ padding: '0px 10px' }}>
                <Search
                  placeholder="input search assembly"
                  onSearch={value => this.assemblySearch(value)}
                  style={{ width: '100%' }}
                />
                <div className={styles['line']}></div>
              </div>
              <div style={{ padding: '0px 0px 10px 20px', maxHeight: '300px', overflow: 'auto' }}>
                {!isEmpty(config) && config.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={styles['assembly']}
                      draggable={true}
                      onDragStart={event => this.drag(event, item)}
                      style={{ display: item.DomType.includes(assemblySearchValue) || item.name.includes(assemblySearchValue) ? '' : 'none' }}
                    >
                      {/*{BOM_TYPE({
                        DomType: item.DomType,
                        name: item.name,
                        style: item.style,
                        attribute: item.attribute,
                      })}*/}
                      <Popover
                        placement="right"
                        content={BOM_TYPE({
                          DomType: item.DomType,
                          name: item.name,
                          style: item.style,
                          attribute: item.attribute,
                        })}
                        overlayStyle={{ width: '200px', pointerEvents: 'none' }}>
                        {item.DomType}&nbsp;&nbsp;{item.name}
                      </Popover>
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
