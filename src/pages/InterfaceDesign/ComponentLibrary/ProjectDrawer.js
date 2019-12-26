import React, { Component } from 'react';
import { Drawer, Button, Select, Radio, Icon, message } from 'antd';
import { modelName } from '../config';
import { connect } from 'dva';
import styles from './index.less';
import router from 'umi/router';
const { Option } = Select;

@connect(interfaceDesign => interfaceDesign)
class ProjectDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      valuePage: '',
      valueObject: '',
    };
  }
  objectVisibleChange(bool) {
    this.props.dispatch({
      type: `${modelName}/objectVisibleChange`,
      payload: { visible: bool },
    });
  }
  showDrawer = () => {
    this.objectVisibleChange(true);
  };

  onSubmitClose = () => {
    const { valuePage } = this.state;
    const { id } = this.props.routing && this.props.routing.location && this.props.routing.location.query || '';
    console.log(this.props)
    if (valuePage) {
      this.objectVisibleChange(false);
      if (id != valuePage) {
        router.push({
          pathname: '/interfaceDesign',
          query: {
            id: valuePage,
          },
        });
      }
    } else {
      message.warning('请先选择页面！');
    }
  };
  onClose = () => {
    const { id } = this.props.routing && this.props.routing.location && this.props.routing.location.query || '';
    if(id){
      this.objectVisibleChange(false);
    }
  }
  showChildrenDrawer = () => {
    // this.props.dispatch({
    //   type: `${modelName}/findSkinClassByScheme`,
    //   payload: {},
    // });
    this.setState({
      childrenDrawer: true,
    });
  };

  onChildrenDrawerClose = () => {
    this.setState({
      childrenDrawer: false,
    });
  };
  handleChangeObject(value) {
    console.log(value);
    this.setState({
      valueObject: value,
      valuePage: '',
    });
  }
  onChangePage = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      valuePage: e.target.value,
    });
  };
  render() {
    const { valueObject, valuePage } = this.state;
    const { objectVisible } = this.props.interfaceDesign;
    const selectData = [
      { name: 'object1', id: '0001' },
      { name: 'object2', id: '0002' },
    ];
    const pageList = [
      { name: 'page1', id: '0001' },
      { name: 'page2', id: '0002' },
      { name: 'page3', id: '0003' },
      { name: 'page4', id: '0004' },
      { name: 'page5', id: '0005' },
    ];
    return (
      <div>
        <Drawer
          title="项目列表"
          width={520}
          closable={false}
          onClose={this.onClose}
          visible={objectVisible}
        >
          <div style={{ padding: '20px 0', display: 'flex' }}>
            <div style={{ width: '15%', display: 'inline-block' }}>项目列表:</div>
            <Select
              value={valueObject}
              style={{ width: '70%' }}
              onChange={this.handleChangeObject.bind(this)}
            >
              {selectData.map((v, i) => (
                <Option value={v.id} key="1312313" key={v.id}>
                  {v.name}
                </Option>
              ))}
            </Select>
            <Button type="primary" onClick={this.showChildrenDrawer} style={{ marginLeft: '10px' }}>
              新增项目
            </Button>
          </div>
          <div>
            <p>项目对应页面栏</p>
            {valueObject !== '' && (
              <>
                <Radio.Group
                  onChange={this.onChangePage}
                  value={valuePage}
                  style={{ width: '100%' }}
                >
                  {pageList.map((v, i) => (
                    <Radio value={v.id} className={styles['radioStyle']} key={v.id}>
                      {v.name}
                      <div style={{ float: 'right', padding: '0 10px' }}>
                        <Icon type="delete" />
                      </div>
                    </Radio>
                  ))}
                </Radio.Group>
                <Button
                  type="primary"
                  onClick={this.showChildrenDrawer}
                  style={{ margin: '10px 0', width: '100%' }}
                >
                  新建页面
                </Button>
              </>
            )}
          </div>
          <Drawer
            title="新增项目"
            width={320}
            closable={false}
            onClose={this.onChildrenDrawerClose}
            visible={this.state.childrenDrawer}
          >
            This is two-level drawer
          </Drawer>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 16px',
              textAlign: 'right',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }}
          >
            <Button
              style={{
                marginRight: 8,
              }}
              onClick={this.onClose}
            >
              Cancel
            </Button>
            <Button onClick={this.onSubmitClose} type="primary">
              Submit
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default ProjectDrawer;
