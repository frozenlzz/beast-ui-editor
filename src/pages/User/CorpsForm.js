import React, { Component } from 'react';
import { Badge, Button, Icon, message, Modal, Radio, Spin } from 'antd';
import { findUserCorp } from '@/services/login';
import { isArray, isEmpty } from 'lodash';

export const showInitModal = () => {
  const modal = Modal.info({
    width: 300,
    icon: null,
    centered: true,
    // title: 'This is a notification message',
    content: (
      <div style={{ textAlign: 'center', overflow: 'hidden' }}>
        <Spin style={{ margin: '8px auto' }} size={'large'}/>
        <div style={{ margin: '16px auto' }}>系统正在初始化，预计需要2~3分钟</div>
        <Button type={'primary'} style={{ width: '100%' }} onClick={() => {
          modal.destroy();
        }}>确定</Button>
      </div>
    ),
    okButtonProps: {
      style: { display: 'none' },
    },
  });
};

class CorpsForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      spinning: false,
      cropsData: [], // 公司列表
      cropInd: 0,
    };
  }

  componentDidMount() {
    this.getCorps();
  }


  getCorps() {
    if (this.props.ident) {
      const { onConfirm, onError, ident } = this.props;
      const $this = this;

      $this.setState({ spinning: true });
      findUserCorp({ ident: ident }).then(res => {

        if (res && (200 === res.status || 1 === res.status) && isArray(res.data) && !isEmpty(res.data)) {

          // 如果只有一个公司
          if (res.data.length === 1) {
            const tmpObj = res.data[0];

            // 如果公司已初始化完成，则默认登录此公司
            if (tmpObj.initialized) {
              onConfirm && onConfirm(tmpObj['domainName'], tmpObj);

            } else {
              // 如果公司未初始化完成，提示“正在初始化”
              $this.showInitModal();
            }
          }
          // 有多个公司，则将公司列出来，让用户选择
          $this.setState({ cropsData: res.data, spinning: false });

        } else {
          onError && onError(res);
          $this.setState({ spinning: false });
        }
      });
    }
  }

  changeCrop(e) {
    this.setState({
      cropInd: e.target.value,
    });
  }

  confirmCrop() {
    const cropObj = this.state.cropsData[this.state.cropInd];
    // console.log('crop', cropObj);
    if (cropObj) {
      if (!cropObj.initialized) { // 公司还在初始化
        showInitModal();
      } else { // 公司初始化完成，则登录此公司
        const { onConfirm } = this.props;
        onConfirm && onConfirm(cropObj.domainName, cropObj);
      }
    }
  }

  render() {
    const { cropsData, cropInd, spinning } = this.state;
    const radioStyle = {
      display: 'block',
      height: '50px',
      lineHeight: '50px',
      borderBottom: '1px dashed #e0e0e0',
    };
    return (
      <div style={{ textAlign: 'left' }}>
        <h3 className={'text-center'}>请选择公司</h3>
        <Radio.Group style={{ width: '100%' }} onChange={this.changeCrop.bind(this)}
                     value={cropInd}>
          {
            cropsData.map((v, k) => (
              <Radio style={radioStyle} key={k} value={k}>
                {v.enterpriseName}
                {
                  false === v.initialized &&
                  <Badge style={{ float: 'right' }} status="processing" text="正在初始化"/>
                }
              </Radio>
            ))
          }
        </Radio.Group>
        <Button type={'primary'}
                loading={spinning}
                size={'large'}
                style={{ width: '100%', marginTop: 32 }}
                onClick={this.confirmCrop.bind(this)}><Icon type="check"/> 确定</Button>
        <Button type={'primary'}
                ghost
                size={'large'}
                style={{ width: '100%', marginTop: 8 }}
                onClick={this.getCorps.bind(this)}>
          <Icon type="sync"/> 刷新
        </Button>
      </div>
    );
  }
}

CorpsForm.defaultProps = {
  ident: '',// String 获取公司信息的字段值，即请求 findCorpByIdent 接口的参数值
  onConfirm: null, // Function 确认选择公司之后的回调；function(domainName, corpObj)
  onError: null, // Function 查找公司信息失败之后的回调；function(rsp)
};

export default CorpsForm;
