import React, { Component, Fragment } from 'react';
import { Checkbox, Icon, message, Spin, Form, Modal, Button, Radio, Badge, AutoComplete, Alert, Input } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import styles from './Login.less';
import { Login } from 'ant-design-pro';
import request, { jsonPost, reqGet } from '@/helpers/request';
import Captcha from '/common/components/Captcha';
import apiConfig from '@/apiConfig';
import classNames from 'classnames';
import { getStorage, removeStorage, setStorage, urlEncode } from '/common/utils/utils';
// import { pick } from 'lodash';
import { findCorpInfo, findUserInfo } from '@/services/global';
import { findUserCorp, validateHost } from '@/services/login';
import isFunction from 'lodash/isFunction'
import pick from 'lodash/pick'
import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'

import { pswSha1 } from '@/helpers/loginUtils';

const { Submit, Tab, UserName, Password } = Login;
let domainName = '';

let hostArr = window.location.host.split('.');
hostArr.splice(hostArr.length - 2);
let curHost = hostArr.join('.');

@connect(({ login }) => ({
  login,
}))
@Form.create()

class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: 'tab1',
      autoLogin: true,
      authorType: '',
      spinning: false,
      cropsData: [], // 公司列表
      cropInd: 0,
      showCropsModal: false, // 公司列表弹框
      values: {},
      corpInfo: {},//查找公司信息
      isRoot: false, //判断是否主公司
      domainName: '',//域名,
      domainNameAble: {
        able: true,
        content: '',
      }, //域名是否可用
      host: '', //登录时用户输入的站点域名

    };
    // 如果url上带有参数，则静默的登录
    const { location } = this.props;
    if (!isEmpty(location.query) && 'y' === location.query.defaultLogin) {
      this.defaultLogin = true;
      this.state.spinning = true;
      this.openid = location.query.openid;

      if (location.query.phone) { // 手机登录
        this.state.values = pick(location.query, ['phone', 'captcha', 'Auth']);
        this.state.type = 'tab2';

      } else if (location.query.values) { // 账号密码登录
        try {
          this.state.values = JSON.parse(location.query.values);
          this.state.host = this.state.values.host;
        } catch (e) {
        }
      }

    }
  }
//render()内部
  componentDidUpdate(){
    if(this.onkeydown){
      document.addEventListener('keydown',this.onkeydown);
    }
  }
  componentDidMount() {
    // 如果url上带有参数，则静默的登录
    const { location,username } = this.props;
    if (this.defaultLogin) {
      // 微信登录
      if (this.openid) {
        this.wxLogin();
      } else if (this.state.values.phone) {// 手机登录
        // console.log(`手机登录`);
        this.mobileLogin(pick(location.query, ['phone', 'captcha', 'Auth']));

      } else if (this.state.values.username && this.state.values.password) {
        // 账号密码登录
        // console.log(`账号密码登录`);
        this.pwdLogin(this.state.values, false);
      }
    }
    this.findCorpInfoFn();
  }
  onkeydown = (e)=>{
    console.log('onkeydown....');
    let $this = this;
    if (e.keyCode === 13) {
      $this.setState({ spinning: true }, () => {
        // 登录
        this.onSubmit();
      });
    }
  }
  findCorpInfoFn() {
    findCorpInfo({}).then(
      res => {
        if (res && res.data) {
          this.setState({
            corpInfo: res.data || {},
            // domainName: '.' + dArr[dArr.length - 2] + '.' + dArr[dArr.length - 1],
            // host: dName === window.location.host ? '' : curHost,
          }, () => {
            const {corpInfo} = this.state;
            if (corpInfo){
              this.props.dispatch({
                type:'login/corpInfoData',
                payload: {
                  corpInfo:corpInfo
                }
              })
            }
            this._judgeRoot();
          });
        }
      },
    );
  }

  _judgeRoot() {
    this.setState({
      isRoot: window.location.host === this.state.corpInfo.domainName,
    });
  }

  // checkDomain(value) {
  //   this.setState({ host: value });
  //   if (isEmpty(value)) {
  //     // console.log('input的框框为空');
  //     this.setState({ domainNameAble: { able: true, content: '请输入注册域名' } });
  //     return false;
  //   }
  //
  //   let host = `${value}${this.state.domainName}`;
  //   return this.checkd(host);
  // }

  async checkd(host) {
    let $this = this;
    let res = await validateHost({ host });
    if (res && res.data === false) {
      $this.setState({ domainNameAble: { able: false, content: '' } });
      return true;
    } else {
      $this.setState({ domainNameAble: { able: true, content: '域名未注册' } });
      return false;
    }
  }

  onSubmit = async (e) => {
    const $this = this;
    let validateFields = null;
    if ('tab1' === this.state.type) { // 账号密码

      // 判断是否子丶主公司
      // if ($this.state.isRoot) {
      //   let isOk = await this.checkDomain(this.state.host);
      //   if (!isOk) {
      //     return false;
      //   }
      // }
      // 如果是账号密码登录，用 this.loginFrom
      const { validateFields } = this.loginFrom;
      validateFields((err, values) => {
        if (!err) {
          // 如果不是“总公司”或者“当前输入的域名的子公司”，则跳转到输入的域名下登录
          // if ($this.state.isRoot || curHost !== $this.state.host) {
          //   // console.log(values);,
          //   const loginData = { ...values, host: $this.state.host };
          //   loginData.password = pswSha1(loginData);
          //   let isYes = 'y';
          //   let href = window.location.host === 'localhost' ?
          //     'http://localhost/saas'
          //     // 'http://jz.saas.easydemo.me/projects/fore-end/saas/dist'
          //     :
          //     `${window.location.protocol}//${$this.state.host}${$this.state.domainName}${window.location.pathname}`;
          //
          //   window.location.href = (`${href}/#/user/login?values=${JSON.stringify(loginData)}&defaultLogin=${isYes}`);
          //   //为什么域名和文件路径什么的都重新拼写了还能访问到/#/user/login这个页面
          //   return;
          // }

          // $this.state.
          $this.setState({ spinning: true }, () => {
            // 登录
            this.pwdLogin(values);
          });
        }
      });
    } else {
      // 如果是手机号登录，用 this.pros.form
      const { validateFields } = this.props.form;
      console.log(`登录时候是手机号登录`);
      validateFields((err, values) => {
        if (!err) {
          $this.setState({ spinning: true, values: values }, () => {
            // 查询公司信息，获取域名
            $this.findUserCorps(values);
          });
        }
      });
    }
  };

  // 查询手机号是否已注册公司
  canRegisterByPhone(phone) {
    return findUserCorp({ ident: phone }).then(rsp => {
      if (rsp && (200 === rsp.status || 1 === rsp.status)) {
        return isEmpty(rsp.data);
      } else {
        return true;
      }
    });
  }

  findUserCorps(values) {
    const $this = this;
    findUserCorp({ ident: values.phone }).then(res => {

      if (res && (200 === res.status || 1 === res.status) && isArray(res.data) && !isEmpty(res.data)) {

        // 如果只有一个公司
        if (res.data.length === 1) {
          const tmpObj = res.data[0];

          // 如果公司已初始化完成，则默认登录此公司
          if (tmpObj.initialized) {
            domainName = tmpObj['domainName'];
            $this.mobileLogin(values);

          } else {
            // 如果公司未初始化完成，提示“正在初始化”
            $this.showInitModal();
            $this.setState({ spinning: false });
          }

        } else if (res.data.length > 1) {
          // 有多个公司，则将公司列出来，让用户选择
          $this.setState({ cropsData: res.data, spinning: false, showCropsModal: true });
        }

      } else {
        message.error('手机号未注册');
        $this.setState({ spinning: false });
      }
    });
  }

  showInitModal() {
    const infoModal = Modal.info({
      width: 300,
      icon: null,
      centered: true,
      // title: 'This is a notification message',
      content: (
        <div style={{ textAlign: 'center', overflow: 'hidden' }}>
          <Spin style={{ margin: '8px auto' }} size={'large'}/>
          <div style={{ margin: '16px auto' }}>系统正在初始化，预计需要2~3分钟</div>
          <Button type={'primary'} style={{ width: '100%' }} onClick={() => {
            infoModal.destroy();
          }}>确定</Button>
        </div>
      ),
      okButtonProps: {
        style: { display: 'none' },
      },
    });
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
        this.showInitModal();
      } else { // 公司初始化完成，则登录此公司
        domainName = cropObj.domainName;
        this.mobileLogin(this.state.values);
      }
    }
  }

  /**
   * 微信登录
   */
  wxLogin() {
    // 先用 openid 登录，然后调用 loginFunc 获取登录后的信息
    reqGet(apiConfig.setSessionByOpenid, { openid: this.openid }).then(rsp => {
      if (rsp && (200 === rsp.status || 1 === rsp.status)) {
        this.loginFunc({});
      } else {

        if (rsp && ('undefined' !== typeof rsp.status || rsp.states)) {
          message.error(rsp.msg || (rsp.states && rsp.states.message ? rsp.states.message : '登录失败'));
        }

        router.replace('/user/authorLogin');
      }
    });
  }

  /**
   * 手机号登录
   */
  mobileLogin(values) {
    const ajaxData = {
      ...values,
      Auth: 'sms',
    };

    // 如果当前域名不是公司域名，则带着参数跳转到该域名，静默登录
    if ('localhost' !== window.location.host && domainName && domainName !== window.location.host) {
      window.location.replace(`${window.location.protocol}//${domainName}${window.location.pathname}#/user/login?${urlEncode({
        ...ajaxData,
        defaultLogin: 'y',
      })}`);
      return false;
    }
    this.loginFunc(ajaxData);
  }

  /**
   * 用户名密码登录
   * @param values
   * @param neesSha1
   */
  pwdLogin(values, neesSha1 = true) {

    let { username, password } = values;
    if (neesSha1) {
      password = pswSha1(values);
    }
    console.log('username:' + username + '---password:' + password);


    this.setState({ logining: true });
    request(apiConfig.pswLogin, {
      method: 'post',
      // mode: 'cors',
      requestType: 'form',
      data: { username, password, isRemember: this.state.autoLogin },
    }).then(this._afterLogin.bind(this));
  }

  /**
   * 登录请求
   */
  loginFunc(ajaxData) {
    const { dispatch } = this.props;

    this.setState({ logining: true });
    reqGet(apiConfig.login, { ...ajaxData })
    // jsonPost('/login', { ...ajaxData })
      .then(this._afterLogin.bind(this));
  }

  _afterLogin(rsp) {
    const { dispatch } = this.props;
    console.log('rsp>>>>',rsp)
    if (rsp && rsp.isAuthenticated) {
      const stateData = rsp.states || {};
      const dat = {
        id: stateData.userId,
        name: stateData.userName,
        phone: stateData.phone,
        code: stateData.userCode,
        email: stateData.email,
      };
      setStorage('userInfo', dat);
      setStorage('accountInfo', stateData);

      dispatch({
        type: 'global/afterLogin'
      });

      message.success('登录成功', 1).then(() => {
        let timeoutRoute = getStorage('TIMEOUT_ROUTE'); // 登录过期前访问的页面路由
        removeStorage('TIMEOUT_ROUTE');
        removeStorage('SHOWING_TIMEOUT'); // 这是用来避免重复弹出[登录过期提示框]的，登录成功后也要清空
        document.removeEventListener('keydown',this.onkeydown);
        // 标识是不是在 “iframe"里面
        let isIframe = 'LOGIN' === getStorage('IFRAME_APP');
        // 如果是在 iframe 里，则清空标识，然后关闭当前iframe
        if (isIframe) {
          removeStorage('IFRAME_APP');
          // 通过调用父窗口的 dvaDispatch 方法，触发父窗口相应的 action，以关闭 iframe
          if (window.parent && isFunction(window.parent.dvaDispatch)) {
            window.parent.dvaDispatch({
              type: 'global/loginTimeout',
              payload: false,
            });
          }
        } else {
          // window.location.replace(`${window.location.protocol}//${domainName}/${window.location.pathname}#/`);
          router.replace(timeoutRoute || '/');
        }
      });
    } else {
      if (rsp && ('undefined' !== typeof rsp.status || rsp.states)) {
        message.error(rsp.msg || (rsp.states && rsp.states.message ? rsp.states.message : '账号或密码错误'));
      }

      if (this.defaultLogin) {
        this.defaultLogin = false;

        if (this.openid) {
          router.replace('/user/authorLogin');
        } else {
          router.replace('/user/login');
        }
      }
    }

    this.setState({ spinning: false, logining: false });
  }

  onTabChange = key => {
    this.setState({
      type: key,
    });
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };
  //
  // onAuthorLogin = (e, authorType) => {
  //   this.setState({
  //     authorType: authorType,
  //   });
  // };

  closeModal() {
    this.setState({ showCropsModal: false, showInitModal: false });
  };

  //判断点击的键盘的keyCode是否为13，是就调用上面的搜索函数
  handleEnterKey = (e) => {
    if(e.nativeEvent.keyCode === 13){ //e.nativeEvent获取原生的事件对像
        this.onSubmit()
    }
  }
  render() {
    if (this.defaultLogin) {
      return <Spin spinning={true} size={'large'} style={{ display: 'block', margin: '100px auto' }}/>;
    }
    // let pwsGetFieldDecorator;
    // if (this.loginFrom) {
    //   pwsGetFieldDecorator = this.loginFrom.getFieldDecorator;
    // }
    const { getFieldDecorator } = this.props.form;
    const { cropsData, domainNameAble, isRoot } = this.state;
    let defaultHost = this.state.values.host ? this.state.values.host : (
      isRoot ? '' : this.state.host
    );

    const radioStyle = {
      display: 'block',
      height: '50px',
      lineHeight: '50px',
      borderBottom: '1px dashed #e0e0e0',
    };

    // 标识是不是在 “iframe"里面
    // 如果在 iframe 里，不显示 “域名输入框” 和 *注册账户*
    let iframeApp = getStorage('IFRAME_APP');
    let isIframe = 'LOGIN' === iframeApp;

    return (
      <div className={styles.main}>

        {/*{*/}
        {/*  this.state.isRoot&&*/}
        {/*  <Alert*/}
        {/*    message="请访问注册时的网址登录"*/}
        {/*    type="warning"*/}
        {/*    closable*/}
        {/*  />*/}
        {/*}*/}
        <Login
          defaultActiveKey={this.state.type}
          onTabChange={this.onTabChange}
          onSubmit={this.onSubmit}
          ref={form => {
            this.loginFrom = form;
          }}
        >
          <>
            <h1 style={{textAlign:'center',paddingTop:30}}>账户密码登录</h1>
            {
              !isIframe && (
                <div style={{ padding: '0 2px' }}>
                  {/*<Input*/}
                  {/*  key={this.state.domainName}*/}
                  {/*  defaultValue={defaultHost}*/}
                  {/*  placeholder="站点域名"*/}
                  {/*  prefix={<Icon type="global" style={{ color: 'rgba(0,0,0,.25)' }}/>}*/}
                  {/*  size={'large'}*/}
                  {/*  addonAfter={this.state.domainName}*/}
                  {/*  onBlur={(e) => {*/}
                  {/*    this.checkDomain(e.target.value);*/}
                  {/*  }}*/}
                  {/*  style={domainNameAble.able && domainNameAble.content !== '' ? {*/}
                  {/*    border: '1px solid #f5222d',*/}
                  {/*    borderRadius: '4px',*/}
                  {/*    transition: 'color 0.3s',*/}
                  {/*  } : { marginBottom: 20 }}*/}
                  {/*/>*/}

                  {
                    domainNameAble.able && domainNameAble.content !== '' &&
                    <div style={{
                      fontSize: '12px',
                      color: '#f5222d',
                      marginBottom: '20px',
                      transition: 'color 0.3s',
                    }}>{domainNameAble.content}</div>
                  }
                </div>
              )
            }
              <UserName name="username" placeholder="请输入你的账户" defaultValue={this.state.values.username}
                        rules={[{ required: true, message: '请输入你的账户' }]} onKeyPress={this.handleEnterKey}/>
              <Password name="password" placeholder="请输入你的密码" rules={[{ required: true, message: '请输入你的密码' }]} onKeyPress={this.handleEnterKey}/>
            <div className={'ant-row ant-form-item'}>
              <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
                记住我
              </Checkbox>
              <Link className={styles.register} to="/user/findPassword">
                忘记密码
              </Link>
            </div>
          </>
          {/*<Tab key="tab2" tab="手机登录">*/}

          {/*  <Captcha form={this.props.form}*/}
          {/*           getCaptchaType={0}*/}
          {/*           size="large"*/}
          {/*           mobileFieldName="phone"*/}
          {/*           mobileOptions={{ initialValue: this.state.values.phone }}*/}
          {/*           mobileRules={[{*/}
          {/*             validator: async (rule, value, callback) => {*/}
          {/*               // 判断手机号是否已注册*/}
          {/*               let canPhoneRegister = await this.canRegisterByPhone(value);*/}
          {/*               // console.log('canPhoneRegister', canPhoneRegister);*/}
          {/*               if (canPhoneRegister) {*/}
          {/*                 callback('该手机号未注册');*/}
          {/*               } else {*/}
          {/*                 callback();*/}
          {/*               }*/}
          {/*             },*/}
          {/*           }]}*/}
          {/*           captchaFieldName="captcha"*/}
          {/*           captchaOptions={{ initialValue: this.state.values.captcha }}*/}
          {/*           getFieldDecorator={getFieldDecorator}*/}
          {/*           getCodeBtnClass={styles.getCaptcha}/>*/}

          {/*</Tab>*/}

          <Submit size="large" loading={this.state.spinning || this.state.logining} onKeyDown={(e)=>this.onkeydown(e)}>登录</Submit>

          <div style={{paddingBottom:20}} className="ant-row ant-form-item">
            其它登录方式
            {

              <Link to="/user/authorLogin">
                <Icon
                  type="wechat"
                  className={classNames(styles.icon, styles.wechat)}
                  theme="outlined"
                  // onClick={e => {
                  //   this.onAuthorLogin(e, 'wechat');
                  // }}
                />
              </Link>
            }
            <Link to="/user/authorLogin">
              <Icon
                type="qq"
                className={classNames(styles.icon, styles.qq)}
                theme="outlined"
                // onClick={e => {
                //   this.onAuthorLogin(e, 'qq');
                // }}
              />
            </Link>

            {/*{*/}
            {/*  !isIframe && (*/}
            {/*    <Link className={styles.register} to={`/user/register?domainName=${this.state.corpInfo.domainName}`}>*/}
            {/*      注册账户*/}
            {/*    </Link>*/}
            {/*  )*/}
            {/*}*/}

          </div>
        </Login>

        {
          (this.state.showCropsModal) && (
            <Modal
              // width={300}
              title={'请选择登录的公司'}
              visible={this.state.showCropsModal}
              onCancel={this.closeModal.bind(this)}
              footer={null}
              maskClosable={false}
              keyboard={false}
              centered={true}
            >
              {
                this.state.showCropsModal && (
                  <div style={{ textAlign: 'left' }}>
                    <Radio.Group style={{ width: '100%' }} onChange={this.changeCrop.bind(this)}
                                 value={this.state.cropInd}>
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
                            loading={this.state.logining}
                            size={'large'}
                            style={{ width: '100%', marginTop: 32 }}
                            onClick={this.confirmCrop.bind(this)}>确定</Button>
                  </div>
                )
              }
            </Modal>
          )
        }
      </div>
    );
  }

}

export default LoginPage;
