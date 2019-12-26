import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,
} from 'antd';
import styles from './FindPassword.less';
import Link from 'umi/link';
import { Login } from 'ant-design-pro';
//const {  UserName, Password, Mobile, Captcha, Submit,Tab } = Login;
import Captcha from '/common/components/Captcha';
import { cloneDeep, isEmpty } from 'lodash';
import { findUserCorp } from '@/services/login';

import router from 'umi/router';
//const { Captcha } = Login;

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

@connect()
@Form.create({ name: 'normal_find_password' })
class FindPasswordPage extends Component {

  state = {
    count: 60,
    confirmDirty: false,
    btnText: '获取验证码',
    visible: false,
    help: '',
    prefix: '86',
  };

  onGetCaptcha = () => {
    this.setState({
      visible: true,
    });
    let interval = window.setInterval(() => {
      if (interval) {
        let tempCount = this.state.count;
        if (1 == tempCount) {
          this.setState({
            visible: false,
            count: 60,
            btnText: '获取验证码',
          });
          interval = null;
        } else {
          --tempCount;
          this.setState({
            count: tempCount,
            btnText: `${tempCount} s`,
          });
        }
      }
    }, 1000);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(`进入这个方法了`)
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return false;
      }

      let ajaxData = cloneDeep(values);
      delete ajaxData['password'];
      dispatch({
        type: 'global/resetPassword',
        payload: ajaxData,
      });

    });

  };


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

  render() {

    const { count, visible, btnText } = this.state;

    const { getFieldDecorator } = this.props.form;

    //console.log('getFieldDecorator:',getFieldDecorator);
    return (
      <div className={styles.main}>
        <h3>忘记密码</h3>
        <Form layout="horizontal">
          <Captcha form={this.props.form}
                   getCaptchaType={2}
                   size="large"
                   mobileFieldName="phone"
                   mobileRules={[{
                     validator: async (rule, value, callback) => {
                       // 判断手机号是否已注册
                       let canPhoneRegister = await this.canRegisterByPhone(value);
                       // console.log('canPhoneRegister', canPhoneRegister);
                       if (canPhoneRegister) {
                         callback('该手机号未注册');
                       } else {
                         callback();
                       }
                     },
                   }]}
                   captchaFieldName="captcha"
                   getFieldDecorator={getFieldDecorator}
                   getCodeBtnClass={styles.getCaptcha}/>

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
                     placeholder="请再次确认新密码"/>,
            )}

          </FormItem>
          <FormItem>
            <Button
              className={styles.submit}
              type="primary"
              onClick={this.handleSubmit.bind(this)}
            >
              确定
            </Button>
            <Link className={styles.login} to="/User/Login">
              账户登录
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

//const WrappedNormalFindPasswordForm = Form.create({ name: 'normal_find_password' })(FindPasswordPage);

export default FindPasswordPage;
