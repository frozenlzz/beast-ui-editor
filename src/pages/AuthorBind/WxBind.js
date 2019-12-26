import React, { Component } from 'react';
import { Button, Spin } from 'antd';
import router from 'umi/router';
import Result from '/common/components/Result';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import { reqGet } from '@/helpers/request';
import { api } from './config';
// import { getUserInfo } from '/common/utils/utils';
import { connect } from 'dva';

const resultObj = {
  success: {
    type: 'success',
    title: '恭喜您，绑定成功！',
    description: '您已成功绑定微信，之后可以直接微信扫码登录',
    backTxt: '确定',
  },
  error: {
    type: 'error',
    title: '非常抱歉，绑定失败',
    description: '绑定过程似乎不是很顺利，请稍后重试',
    backTxt: '重新绑定',
  },
};

@connect()
class WxBind extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      resultType: '',
    };

    const { location } = props;
    if (!isEmpty(location.query) && location.query.code) {
      this.code = location.query.code;
      this.userId = location.query.userId;
      this.state.loading = true;
    }
  }

  componentDidMount() {
    // const userInfo = getUserInfo();
    if (this.code && this.userId) {
      const { dispatch } = this.props;

      reqGet(api.wxBindApi, {
        code: this.code,
        userId: this.userId,
      }).then(rsp => {
        let resultType = 'success';
        if (rsp && (200 === rsp.status || 1 === rsp.status)) {
          // 更新全局用户信息
          dispatch({
            type: 'global/findSelfInfo',
          });
        } else {
          resultType = 'error';
          if (rsp && rsp.msg) {
            resultObj.error.description += ` 【${rsp.msg}】`;
          }
        }
        this.setState({ loading: false, resultType });
      });
    }
  }

  render() {
    if (this.state.loading) {
      return <Spin spinning={true} style={{ display: 'block', margin: '100px auto' }}/>;
    }

    const { resultType } = this.state;
    const resultO = resultObj[resultType] || {};

    return (
      <Result
        {...omit(resultO, ['backTxt'])}
        style={{ marginTop: 48, marginBottom: 16 }}
        actions={(<div style={{ textAlign: 'center' }}>
          <Button size='large'
                  style={{ width: 200 }}
                  onClick={() => {
                    router.replace('/userSetting');
                  }}
                  type="primary"
          >
            {resultO.backTxt || '返回'}
          </Button>
        </div>)}
      />
    );
  }
}

export default WxBind;
