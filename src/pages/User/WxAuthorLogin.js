import React, { Component } from 'react';
import { Tabs, message, Button } from 'antd';
import styles from './AuthorLogin.less';
import Link from 'umi/link';
import { urlEncode } from '/common/utils/utils';
import { isEmpty } from 'lodash';
import { getWxIDByCode } from '@/services/login';
import CorpsForm from '@/pages/User/CorpsForm';
import Result from '/common/components/Result';
import router from 'umi/router';

class WxAuthorLogin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cropsData: [], // 公司列表
      cropInd: 0,
      showErr: false, // 显示错误提示页
    };
    this.openid = '';

    const { location } = props;
    if (!isEmpty(location.query) && location.query.code) {
      this.isScaned = true;
      this.code = location.query.code;
      this.type = location.query.type;
    }
  }

  componentDidMount() {
    console.log('cdm');
    // 如果是扫码之后的回调，则先根据 code 获取openid
    if (this.isScaned) {
      const $this = this;
      $this.setState({ spinning: true });
      getWxIDByCode({ code: this.code }).then(res => {

        if (res && (200 === res.status || 1 === res.status) && !isEmpty(res.data)) {
          $this.openid = res.data;
          $this.setState({ spinning: false });
        } else {
          message.error('获取微信用户信息失败，请重新扫码');
          $this.isScaned = false;
          $this.setState({ spinning: false }, () => {
            this.genWxQR();
          });
        }
      });

    } else {
      this.genWxQR();
    }

  }

  genWxQR() {
    // 跳转回扫码登录页
    router.replace('/user/authorLogin');
  }

  /**
   * 没有公司信息的回调，
   * 显示“未绑定账号”提示页面
   */
  handleWhileNoCorp() {
    message.error('微信未绑定账号');
    this.isScaned = false;
    this.setState({ spinning: false, showErr: true }, () => {
      this.genWxQR();
    });
  }

  confirmCrop(domainName, corpObj) {
    console.log('confirmCrop domainName', domainName);
    window.location.replace(`${window.location.protocol}//${domainName || window.location.host}${window.location.pathname}#/user/login?${urlEncode({
      openid: this.openid,
      defaultLogin: 'y',
    })}`);
  }

  render() {

    return (
      <div className={styles.main}>
        {
          (this.isScaned && this.openid) ? (
            <CorpsForm ident={this.openid}
                       onConfirm={this.confirmCrop.bind(this)}
                       onError={this.handleWhileNoCorp.bind(this)}
            />
          ) : (
            this.state.showErr && (
              <Result
                type="info"
                title={'微信未绑定账号'}
                description={'请返回账号登录，或注册新账户'}
                style={{ marginTop: 48, marginBottom: 16 }}
                actions={(<div style={{ textAlign: 'center' }}>
                  {/*<Button size='large'*/}
                  {/*        onClick={() => {*/}
                  {/*          router.push('/user')*/}
                  {/*        }}*/}
                  {/*        type="large"*/}
                  {/*>*/}
                  {/*  返回登录*/}
                  {/*</Button>*/}
                  <Button size='large'
                          style={{ width: 200 }}
                          onClick={() => {
                            router.push('/user/register');
                          }}
                          type="primary"
                  >
                    注册新账户
                  </Button>
                </div>)}
              />
            )
          )
        }

        <div className={styles.accountLogin}><Link to="/user/login">使用已有账户登录</Link></div>
      </div>
    );
  }
}

export default WxAuthorLogin;
