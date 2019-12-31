import React, { Component } from 'react';
import { Tree, Button, Modal, Radio, Alert } from 'antd';
import { isEmpty, cloneDeep, isArray } from 'lodash';
import { modelName, randomString, getKeyToElement } from '../config';
import { connect } from 'dva';

const { TreeNode } = Tree;

@connect(interfaceDesign => interfaceDesign)
class PageTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      autoExpandParent: true,
      selectedKeys: [],
      info: {},
      visible: false,
      value: 0,
    };
  }

  componentDidUpdate(oldProps) {
    if (oldProps.interfaceDesign.currentIndex !== this.props.interfaceDesign.currentIndex) {
      const { currentIndex } = this.props.interfaceDesign;
      this.setState({
        selectedKeys: (currentIndex !== -1 && [currentIndex]) || [],
      });
    }
  }

  // 当前选中的组件对应key值
  currentKeyChange(key = -1) {
    this.props.dispatch({
      type: `${modelName}/keyChange`,
      payload: { key: key },
    });
  }

  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', selectedKeys);
    if (!isEmpty(selectedKeys)) {
      this.currentKeyChange(selectedKeys[0]);
    } else {
      this.currentKeyChange(-1);
    }
    this.setState({ selectedKeys, info });
  };

  renderTreeNodes = data =>
    !isEmpty(data) &&
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={item.name} dataRef={item}/>;
    });

  deleteAssembly(selectedKeys) {
    if (!isEmpty(selectedKeys)) {
      const key = selectedKeys[0];
      console.log(key);
      const _this = this;
      Modal.confirm({
        title: '确定删除元素吗?',
        centered: true,
        onOk() {
          _this.setState(
            {
              selectedKeys: [],
            },
            () => {
              _this.props.dispatch({
                type: `${modelName}/delete`,
                payload: { index: key },
              });
              _this.currentKeyChange(-1);
            },
          );
        },
      });
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    const { config } = this.props;
    let assembly = (!isEmpty(config) && cloneDeep(config[this.state.value])) || {};
    assembly['position'] = {}; // 元素位置
    assembly.position['x'] = 280;
    assembly.position['y'] = 0;
    assembly.key = randomString();
    console.log('assembly', assembly);
    console.log('selectedKeys', this.state.selectedKeys);
    this.props.dispatch({
      type: `${modelName}/add`,
      payload: {
        newObj: assembly,
        index: (!isEmpty(this.state.selectedKeys) && this.state.selectedKeys[0]) || -1,
      },
    });
    this.setState({
      visible: false,
      value: 0,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  onRadioChange = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  };

  currentDomType() {
    const { initData } = this.props;
    const { currentIndex } = this.props.interfaceDesign;
    if (currentIndex !== -1) {
      const newData = getKeyToElement({ data: initData, index: currentIndex });
      return newData.DomType && newData.DomType || '';
    } else {
      return '';
    }
  }

  onDrop = info => {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };
    const data = [...this.props.interfaceDesign.initData];
    let dragObj; // 当前选中的节点元素
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap && isArray(info.node.props.dataRef.children)) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }
    this.props.dispatch({
      type: `${modelName}/initDataChange`,
      payload: { initData: data },
    });
  };
  onDragEnter = info => {
    // console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

  render() {
    const { initData, config } = this.props;
    const { selectedKeys } = this.state;
    // domType 当前选中的页面组件Domtype
    const domType = this.currentDomType();
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <div style={{ padding: '30px 10px 0px 10px', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: '-16px',
            left: '0',
            width: '100%',
            height: '40px',
            lineHeight: '40px',
            background: '#fff',
            zIndex: '49',
            padding: '0 10px',
            textAlign: 'right',
          }}
        >
          {/* 如果为最顶层画布，或者画布，则打开新增组件按钮功能 */}
          <Button
            type="primary"
            size="small"
            style={{ marginRight: '10px' }}
            disabled={!(domType === '' || domType === 'div')}
            onClick={this.showModal}
          >
            新增子组件
          </Button>
          <Button
            type="danger"
            size="small"
            disabled={selectedKeys.length === 0}
            onClick={() => this.deleteAssembly(selectedKeys)}
          >
            删除
          </Button>
          <div style={{ width: '100%', height: '1px', background: '#ddd' }}></div>
        </div>
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <Tree
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            onSelect={this.onSelect}
            selectedKeys={this.state.selectedKeys}
            showLine={true}
            draggable
            onDragEnter={this.onDragEnter}
            onDrop={this.onDrop}
          >
            {!isEmpty(initData) && this.renderTreeNodes(initData)}
          </Tree>
        </div>
        <Modal
          title="组件库"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Alert
            showIcon
            message="新增组件定位默认在左上角(x=280,y=0)"
            type="warning"
            style={{ position: 'absolute', top: '54px', left: '0px', width: '100%' }}
          />
          <div style={{ marginTop: '20px', maxHeight: '400px', overflowY: 'auto' }}>
            <Radio.Group onChange={this.onRadioChange} value={this.state.value}>
              {!isEmpty(config) &&
              config.map((v, i) => (
                <Radio style={radioStyle} value={i} key={`Radio_${i}`}>
                  {v.name}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        </Modal>
      </div>
    );
  }
}

export default PageTree;
