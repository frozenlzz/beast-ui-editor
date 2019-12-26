import React, { Component, PureComponent } from 'react';
import { connect } from 'dva';
import { modelName } from './config';
import styles from './index.less';
import { Card, Row, Col, Form, Button, Upload, Avatar, Icon, Input, Modal, Switch, message, Spin } from 'antd';
import ObjectBox from '/common/componentsTpl/ObjectBox';
import { comboTypes } from '@/globalConfig';
import {appConfig} from '@/appConfig';
import { createDetail } from '/common/components/HocCRUD';
import { getGID, getStorage, getUserInfo } from '/common/utils/utils';
import { cloneDeep, isEmpty, isObject } from 'lodash';
import request, { failHandler, newAbortCtrl, reqGet, jsonPost, formPost } from '@/helpers/request';

import apiConfig from '@/apiConfig';
import router from 'umi/router';
import { setStorage } from '/common/utils/utils';
import { api } from '@/pages/AuthorBind/config';
import { getWxAuthorQR } from '@/helpers/wxUtils';
import cryptoCore from '/common/utils/cryptoCore';
import CryptoJS from '/common/utils/cryptoSha1';
import { updatePassword } from '@/services/global';


const FormItem = Form.Item;
@Form.create({ name: 'normal_find_password' })
@connect(({ loading, userSetting: { detail, isShowDetail }, global }) => ({
  loading, global, detail, isShowDetail,
}))
@createDetail({ modelName })
@connect()
export default class UserSettingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      visiblePassword: false,
      user: props.detail,
    };
    this.itemRef = React.createRef();
    this.showModal = this.showModal.bind(this);
  }

  componentDidMount() {
    this.fetchDetail();
  this.testAsync().then(res=>{
    console.log(res)
  }).catch(err=>{
    console.log(err)
  })
  }
hanshu(time){
    return new Promise(resolve=>{
      setTimeout(()=>{
        resolve(time)
      },time)
    } )
}
  async  testAsync(){
    let a=await this.hanshu(100)
    let a1=await this.hanshu(a+500)
    let a2=await this.hanshu(a1+1000)
    return a2
  }

  fetchDetail() {
    const { dispatch } = this.props;
    this.userInfo = getUserInfo() || {};
    if (!isEmpty(this.userInfo)) {
      dispatch({
        type: `${modelName}/fetchDetail`,
        payload: {
          id: this.userInfo.id,
        },
      }).then((rsp) => {
        this.state.user = { ...this.props.detail };
      });

      // 更新全局用户信息
      dispatch({
        type: 'global/findSelfInfo',
      });
    }
  }

  showModal = (e) => {
    switch (e) {
      case '1':
        this.setState({

          visible: true,
        });
        break;
      case '2':
        this.setState({

          visiblePassword: true,
        });
        break;
    }

  };

  handleCancel = (e) => {
    switch (e) {
      case '1':
        this.setState({

          visible: false,
        });
        break;
      case '2':
        this.setState({

          visiblePassword: false,
        });
        break;
    }
  };

  /**
   * 用户头像上传
   * */
  avatarUpload(file) {
    let formData = new FormData();
    formData.append('file', file);
    return request(apiConfig.uploadFileApi, {
      method: 'POST',
      data: formData,
      contentType: 'multipart/form-data',
    });
  }

  beforeUpload = (file) => {
    // const { form } = this.props;
    let $this = this;
    const fileObj = {
      uid: getGID(),
      originFileObj: file,
    };
    if (-1 !== file.type.search(/image/i)) {
      let reader = new FileReader();
      reader.onload = () => {
        fileObj.thumbUrl = reader.result;
      };
      reader.readAsDataURL(file);
      $this.avatarUpload(file).then((rsp) => {
        if (isObject(rsp)) {
          if (rsp.status == 200 || rsp.status == 1) {
            $this.setState({
              user: { ...$this.state.user, photo: rsp.data },
            });
          } else {
            message.error(rsp.msg);
          }
        } else {
          message.warning('请先登录', () => {
            router.replace('/user/login');
          });
        }
      });
    } else {

      // new Promise((resolve, reject) => {
      //   form.validateFields(['photo'], {}, (err, values) => {
      //     // console.log('err:',err);
      //     err = {
      //       photo:{
      //         errors:[{message:'头像只支持jpeg、jpg、png格式文件',field:'photo'}]
      //       }
      //     };
      //     reject(err);
      //   });
      // });
    }

    return false;
  };

  handleSubmit = e => {
    e.preventDefault();
    const { saveDetail, dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      // console.log('Received values of form: ', values);
      if (!err) {
        this.state.user && (values.id = this.state.user.id);
        let photo = !isEmpty(values.photo) ? values.photo.substr(values.photo.indexOf('=')+1) : '';
        saveDetail({ ...values, photo }).then(rsp => {
          // console.log(rsp);
          if (isObject(rsp)) {
            if (rsp.status == 200 || rsp.status == 1) {
              message.success('保存成功');
              // 更新全局用户信息
              dispatch({
                type: 'global/findSelfInfo',
              });
            } else {
              message.error(rsp.msg);
            }
          }
        });
      }
    });
  };


  render() {
    const { form } = this.props,
      { getFieldDecorator } = form,
      { user } = this.state;
    // console.log('this.props:',this.props);
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      labelAlign: 'left',
    };
    const ItemMarginTop = {
      // marginTop: 25,
    };
    console.log('参数....>',this.props)
    return (
      <>
        <div className={styles.userSettingWrapper}>
          <Card title="用户中心">
            <Row>
              <Col span={12}>
                <Row>
                  <Col span={3}>
                    <Avatar size={56} icon="user" src={user.photo}/>
                  </Col>
                  <Col span={21} style={{ padding: '0 10px' }}>
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                      <Form.Item
                        label=""
                        extra="点击上传头像更换用户头像"
                      >
                        <Upload
                          name="logo"
                          listType="picture"
                          showUploadList={false}
                          beforeUpload={this.beforeUpload}
                        >
                          <Button>
                            <Icon type="upload"/> 上传头像
                          </Button>
                        </Upload>
                      </Form.Item>
                      <Form.Item label="账号编码" style={ItemMarginTop}>
                        {user.code}
                      </Form.Item>
                      <Form.Item label="所属部门" style={ItemMarginTop}>
                        {getFieldDecorator('dept', {
                          initialValue: user.dept,
                          rules: [{
                            required: true,
                            message: '请选择部门',
                          }],
                        })(
                          <ObjectBox
                            // appCode={appConfig.DEPARTMENT.finderCode}
                                     dispatch={this.props.dispatch}
                                     compData={this.props.global[appConfig.DEPARTMENT]}
                                     nativeProps={{ placeholder: `请选择部门` }}/>,
                          //<ObjectBox appCode={comboTypes.DEPARTMENT}
                            //         dispatch={this.props.dispatch}
                             //        compData={this.props.global[comboTypes.DEPARTMENT]}
                              //       nativeProps={{ placeholder: `请选择部门` }}/>,
                        )}
                      </Form.Item>
                      {/*<Form.Item label="当前职务" style={ItemMarginTop}>*/}
                      {/*  {getFieldDecorator('job', {*/}
                      {/*    initialValue: user.job,*/}
                      {/*    // rules: [*/}
                      {/*    //   {*/}
                      {/*    //     required: true,*/}
                      {/*    //     message: '请选择职务',*/}
                      {/*    //   },*/}
                      {/*    // ],*/}
                      {/*  })(*/}
                      {/*    //<ObjectBox appCode={comboTypes.JOB} nativeProps={{ placeholder: `请选择职务` }}/>,*/}
                      {/*    <ObjectBox appCode={appConfig.JOB.finderCode}  compData={this.props.global[appConfig.JOB]} nativeProps={{ placeholder: `请选择职务` }}/>,*/}
                      {/*  )}*/}
                      {/*</Form.Item>*/}
                      <Form.Item label="真实姓名" style={ItemMarginTop}>
                        {getFieldDecorator('name', {
                          initialValue: user.name,
                          rules: [{
                            required: true,
                            message: '请输入真实姓名',
                          }],
                        })(
                          <Input placeholder="请输入真实姓名"/>,
                        )}
                      </Form.Item>

                      <Form.Item
                        label={' '} colon={false}
                        // wrapperCol={{ span: 12, offset: 6 }}
                        // style={ItemMarginTop}
                      >
                        <Button type="primary" htmlType="submit">确定保存</Button>
                      </Form.Item>
                      <Form.Item>
                        {getFieldDecorator('photo', {
                          initialValue: user.photo,
                        })(
                          <Input type="hidden"/>,
                        )}
                      </Form.Item>
                    </Form>
                  </Col>
                </Row>
              </Col>
              {/*绑定第三方账号*/}
              <Col span={6}>
                <Card
                  style={{ width: 290, margin: '0 auto' }}
                  cover={<img alt="example" src={require('@/assets/author_pic.png')}/>}
                  bodyStyle={{ padding: 10 }}
                  hoverable={true}
                  onClick={this.showModal.bind(this, '1')}
                >
                  <Row>
                    <Col span={20} className={styles.settingInfo}>
                      <p className={styles.settingTitle}>绑定第三方账号</p>
                      <p className={styles.settingDesc}>绑定后可通过第三方应用扫码登录</p>
                    </Col>
                    <Col span={4}>
                      <a href="javascript:;" onClick={this.showModal.bind(this, '1')}>设置</a>
                    </Col>
                  </Row>
                </Card>
              </Col>
              {/*修改密码*/}
              <Col span={6}>
                <Card
                  style={{ width: 290, margin: '0 auto' }}
                  cover={<img alt="example" src={require('@/assets/author_pic.png')}/>}
                  bodyStyle={{ padding: 10 }}
                  hoverable={true}
                  onClick={this.showModal.bind(this, '2')}
                >
                  <Row>
                    <Col span={20} className={styles.settingInfo}>
                      <p className={styles.settingTitle}>账户密码</p>
                      <p className={styles.settingDesc}>已设置可以通过账户密码登录</p>
                    </Col>
                    <Col span={4}>
                      <a href="javascript:;" onClick={this.showModal.bind(this, '2')}>设置</a>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
        <Modal
          title="绑定第三方账号"
          visible={this.state.visible}
          footer={false}
          onCancel={this.handleCancel.bind(this, '1')}
          width={450}
          destroyOnClose={true}
        >
          <BindInfoForm form={this.props.form}/>
        </Modal>
        <Modal
          title="更改账户密码"
          visible={this.state.visiblePassword}
          footer={false}
          onCancel={this.handleCancel.bind(this, '2')}
          width={450}
          destroyOnClose={true}
        >
          <BindPasswordForm form={this.props.form} handleCancel={this.handleCancel}/>
        </Modal>
      </>
    );
  }
}

@connect(({ global: { userInfo } }) => ({
  userInfo: userInfo,
}))
// 绑定第三方账号
class BindInfoForm extends Component {
  state = {
    loading: false,
    showWxQR: false,

  };

  handleWxUnbind() {
    const userInfo = this.props.userInfo || {};
    if (userInfo && userInfo.id) {

      const { dispatch } = this.props;
      const $this = this;
      Modal.confirm({
        title: '确认解绑微信吗?',
        content: '解绑之后，将无法使用微信扫码登录',
        onOk() {

          $this.setState({ loading: true });
          reqGet(api.unBindUser, {
            userId: userInfo.id,
          }).then(rsp => {
            if (rsp && (200 === rsp.status || 1 === rsp.status)) {
              message.success('解绑成功！');
              // 更新全局用户信息
              dispatch({
                type: 'global/findSelfInfo',
              });
            } else {
              failHandler(rsp);
            }
            $this.setState({ loading: false });
          });
        },
      });
    }
  }

  /**
   * 点击绑定微信，显示微信二维码
   */
  handleWxBind() {
    const userInfo = this.props.userInfo || {};
    if (isEmpty(userInfo.weixinOpenid)) {
      this.setState({ showWxQR: true }, () => {
        getWxAuthorQR('wxQR', 'bind', {
          query: {
            userId: userInfo.id,
            jumpUrl: window.location.origin + window.location.pathname + '#/wxBind',
          },
        });
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    // const { form } = this.props,
    //   { getFieldDecorator } = form;
    if (this.state.showWxQR) {
      return (
        <div id={'wxQR'} className={styles.qrcode}>
        </div>
      );
    }
    const userInfo = this.props.userInfo || {};
    const hadWxBind = !isEmpty(userInfo.weixinOpenid);

    return (
      <Row>


        <Col span={12}>
          <Col className={styles.settingBind}>
            <Spin spinning={this.state.loading}>
              <div className={styles.bindIcon}>
                <Avatar className={!hadWxBind ? '' : styles.band}
                        size={48} icon="wechat"/>
              </div>
              <div className={styles.bindDesc}>
                {hadWxBind && '已绑定'}
                {
                  !hadWxBind ? (
                    <a href='javascript:;' onClick={this.handleWxBind.bind(this)}>立即绑定</a>
                  ) : (
                    <a href="javascript:;" onClick={this.handleWxUnbind.bind(this)}>解绑</a>
                  )
                }
              </div>
            </Spin>
          </Col>
        </Col>
        <Col span={12}>
          <Col className={styles.settingBind}>
            <div className={styles.bindIcon}><Avatar size={48} icon="qq"/></div>
            <div className={styles.bindDesc}><a href="javascript:">立即绑定（敬请期待）</a></div>
          </Col>
        </Col>


      </Row>
    );
  }
}

//账户密码
class BindPasswordForm extends Component {
  constructor(props) {
    super(props),
      this.state = {
        newPassword: '',
      };
  }


  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['newPassword'], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('新密码与确认密码不一致');
    } else {
      callback();
    }
  };

  newPasswordChange(e) {
    this.setState({
      newPassword: e.target.value,
    });

  }

  upPasswordSubmit = (e) => {
    e.preventDefault();
    let userInfo = getStorage('userInfo') || {};
    let username = userInfo.code || '';
    let api = '/api/auth/userInfo/updatePassword'//'/api/auth/webAuthoriztion/updatePassword';
    let data = {
      oldPassword: '123',
      newPassword: this.state.newPassword,
    };
    this.props.form.validateFields((err, values) => {
      if (err) {
        return false;
      }
      let ajaxData = cloneDeep(values);
      let { oldPassword, newPassword } = ajaxData;
      var ciphertext = username.toLowerCase() + oldPassword;
      for (var i = 0; i < 1024; i++) {
        ciphertext = cryptoCore.SHA1(ciphertext);
      }
      oldPassword = ciphertext.toString();
      const data = {
        oldPassword,
        newPassword,
      };
      updatePassword(data).then(res => {
        let that = this;
        if (200 === res.status || 1 === res.status) {
          message.info('修改密码成功');
          (function() {
            that.props.handleCancel('2');

          })();
        } else {
          message.info('原密码输入错误');
        }
      });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    // const { form } = this.props,
    //   { getFieldDecorator } = form;

    return (
      <Row>

        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('oldPassword', {
              rules: [
                { required: true, message: '请输入原密码' },
                { validator: this.validateToNextPassword },
              ],
            })(
              <Input type="password"
                     placeholder="6 - 16位原密码,区分大小写"/>,
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: '请输入新密码' },
                { validator: this.validateToNextPassword },
              ],
            })(
              <Input type="password"
                     placeholder="6 - 16位新密码,区分大小写"/>,
            )}

          </FormItem>
          <FormItem>
            {getFieldDecorator('newPassword', {
              rules: [{
                required: true, message: '请输入确认密码',
              }, { validator: this.compareToFirstPassword }],
            })(
              <Input type="password"
                     placeholder="请再次确认新密码"
              />,
            )}

          </FormItem>
          <Form.Item
            label={' '} colon={false}
            // wrapperCol={{ span: 12, offset: 6 }}
            // style={ItemMarginTop}
          >
            <Button type="primary" onClick={this.upPasswordSubmit.bind(this)}>确定修改</Button>
          </Form.Item>
        </Form>
      </Row>
    );
  }
}

