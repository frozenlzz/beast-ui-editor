import React, { Component } from 'react';
import { Tabs } from 'antd';
import styles from './AuthorLogin.less';
import Link from 'umi/link';
// import { Login } from 'ant-design-pro';
import loginQ from '../../assets/login_qrcode.png';
import { getRandomKey } from '/common/utils/utils';
import { getWxAuthorQR } from '@/helpers/wxUtils';

const TabPane = Tabs.TabPane;

class AuthorLoginPage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // 生成微信二维码
    getWxAuthorQR('wxLoginQR');
  }

  render() {

    return (
      <div className={styles.main}>
        <Tabs defaultActiveKey="1" className={styles.tabPane} tabBarGutter={40}
              renderTabBar={() => (<div />)}
              tabBarStyle={{ textAlign: 'center' }}>
          <TabPane tab="微信登录" key="1">
            <div id={'wxLoginQR'} className={styles.qrcode}>
              {/*<div className={styles.qrcode} >*/}
              {/*  <div className={styles.q_img}>*/}
              {/*    <img src={loginQ}/>*/}
              {/*  </div>*/}
              {/*  <div className={styles.q_desc}>请使用微信扫描二维码登录<a className={styles.refresh} href="javascript:;"><Icon*/}
              {/*    type="sync"/> 刷新</a></div>*/}
              {/*</div>*/}
            </div>
          </TabPane>
          {/*<TabPane tab="QQ 登录" key="2">*/}
          {/*  <div className={`${styles.qrcode} ${styles.qrcodeQQ}`}>*/}
          {/*    <div style={{ fontSize: 20 }}>QQ 登录</div>*/}
          {/*    <div className={styles.q_img}>*/}
          {/*      <img src={loginQ}/>*/}
          {/*    </div>*/}
          {/*    <div className={styles.q_desc}>请使用 QQ 扫描二维码登录*/}
          {/*      /!*<a className={styles.refresh} href="javascript:;"><Icon*!/*/}
          {/*      /!*type="sync"/> 刷新</a>*!/*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</TabPane>*/}
        </Tabs>
        <div className={styles.accountLogin}><Link to="/user/login">使用已有账户登录</Link></div>
      </div>
    );
  }
}

export default AuthorLoginPage;
