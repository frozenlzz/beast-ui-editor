import React, { Fragment, Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider, Row, Col, message } from 'antd';
import { assign, isObject, cloneDeep, isEmpty, map, pick } from 'lodash';
import router from 'umi/router';
import styles from '../Register.less';
import moment from 'moment';
import { jsonPost } from '@/helpers/request';
import apiConfig from '@/apiConfig';
import SelectArea from '/common/components/SelectArea';
import 'moment/locale/zh-cn';
import { findUserCorp, registerCorp, validateCorpCode } from '@/services/login';
import Captcha from '/common/components/Captcha';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
let tmpInd = window.location.host.indexOf('.'),
  afterDomain = window.location.host.substr(-1 === tmpInd ? 0 : tmpInd);
if ('localhost' === afterDomain) {
  afterDomain = '.saas.easydemo.me';
}

@connect(({ form, login, global }) => ({
  data: login.step,
  industry: global.industry,
}))
@Form.create()
class Step2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registering: false,
    };
  }

  componentDidMount() {
    const { data, dispatch } = this.props;
    if (isEmpty(data)) {
      router.push('/user/register/regScheme');
    }

    dispatch({
      type: 'global/findByIndustry',
    });
  }

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

  addressToStr = (arr) => {
    let obj = pick(arr, ['country', 'province', 'city', 'area']);
    let address = '';
    for (let o in obj) {
      address += obj[o];
    }
    return address;
  };

  /**
   * 提交注册信息
   */
  onValidateForm = () => {
    const $this = this,
      { validateFields } = this.props.form,
      { data } = this.props;

    validateFields((err, values) => {
      if (!err) {
        let strDate = cloneDeep(data.asStartDate);
        let asStartDateStr = moment(strDate).format('YYYY-MM');
        let stepVal = assign({}, data, values);
        delete stepVal['captcha'];
        stepVal['officeAddr'] = this.addressToStr(values['officeAddr']);
        stepVal['asStartDate'] = asStartDateStr;
        stepVal['domainName'] = `${stepVal['domainName']}${afterDomain}`;

        $this.setState({ registering: true });
        registerCorp(stepVal, {
          params: {
            captcha: values.captcha,
          },
        }).then(rsp => {
          if (rsp && (200 === rsp.status || 1 === rsp.status)) {
            // 查询账户域名

            findUserCorp({ ident: values.phone }).then(res => {
              let domain = window.location.host || window.location.hostname;

              if (res && (200 === res.status || 1 === res.status) && !isEmpty(res.data)) {
                const tmpObj = res.data[0];
                if (tmpObj && !isEmpty(tmpObj['domainName'])) {
                  domain = tmpObj['domainName'];
                }
              }
              window.location.href = `${window.location.protocol}//${domain}${window.location.pathname}#/user/register/regResult`;
            });

            // router.push(`${domain}/user/register/regResult`);
          } else {
            message.error(rsp && rsp.msg ? rsp.msg : '注册失败');
            $this.setState({ registering: false });
            return false;
          }
        });

      }
    });
  };

  /**
   * 上一步
   */
  onPrev = () => {
    const { form, dispatch, data } = this.props;
    //保存当前输入的信息
    form.validateFields(['officeAddr', 'industry', 'uscc', 'phone', 'captcha'], {}, (err, values) => {
      let stepVal = {};
      for (let k in values) {
        if (!isEmpty(values[k])) {
          stepVal[k] = values[k];
        } else {
          stepVal[k] = '';
        }
      }
      if (!isEmpty(stepVal)) {
        let tempObj = assign({}, data, values);
        console.log('tempObj', tempObj);
        dispatch({
          type: 'login/saveStepFormData',
          payload: tempObj,
        });
      }
    });
    router.push('/user/register/regScheme');
  };

  render() {
    const { data, industry } = this.props,
      { getFieldDecorator } = this.props.form;

    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm}>
          <Form.Item {...formItemLayout} label="单位所在地">
            {getFieldDecorator('officeAddr', {
              initialValue: data.officeAddr,
              rules: [{ required: true, message: '请选择单位所在地' }],
            })(<SelectArea size='large' options={data.options} placeholder="placeholder"/>)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="所属行业">
            {getFieldDecorator('industry', {
              initialValue: data.industry,
              rules: [{ message: '请选择行业' }],
            })(<Select size='large' placeholder="请选择行业">
              {map(industry, (o, k) => {
                return (
                  <Option key={`industry_${k}`} value={o.code}>{o.name}</Option>
                );
              })}
            </Select>)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="统一社会信用代码">
            {getFieldDecorator('uscc', {
              initialValue: data.uscc,
              // rules: [{ required: true, message: '请输入统一社会信用代码' }],
            })(<Input size='large' placeholder="请输入统一社会信用代码"/>)}
          </Form.Item>

          <Captcha form={this.props.form}
                   getCaptchaType={1}
                   size="large"
                   mobileFieldName="phone"
                   mobileItemProps={{ ...formItemLayout, 'label': '手机号' }}
                   mobileRules={[{
                     validator: async (rule, value, callback) => {
                       // 判断手机号是否已注册
                       let res = await validateCorpCode({code:value});
                       if (res && res.data) {
                         callback();
                       } else {
                         callback('该手机号已注册');
                       }
                     },
                   }]}
                   mobileInput={<Input size='large' placeholder="请输入手机号"/>}
                   captchaFieldName="captcha"
                   captchaItemProps={{ ...formItemLayout, 'label': '验证码' }}
                   getFieldDecorator={getFieldDecorator}
                   getCodeBtnClass={styles.getCaptcha}
          />
          {/*<Form.Item {...formItemLayout} label="手机号">*/}
          {/*  {getFieldDecorator('phone', {*/}
          {/*    initialValue: data.phone,*/}
          {/*    rules: [{*/}
          {/*      required: true,*/}
          {/*      message: '请输入手机号',*/}
          {/*    },*/}
          {/*      { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },*/}
          {/*    ],*/}
          {/*  })(<Input size='large' placeholder="请输入手机号"/>)}*/}
          {/*</Form.Item>*/}
          {/*<Form.Item {...formItemLayout} label="验证码">*/}
          {/*  <Row gutter={8}>*/}
          {/*    <Col span={16}>*/}
          {/*      {getFieldDecorator('captcha', {*/}
          {/*        initialValue: data.captcha,*/}
          {/*        rules: [{ required: true, message: '输入验证码' }],*/}
          {/*      })(<Input size='large' placeholder="输入验证码"/>)}*/}
          {/*    </Col>*/}
          {/*    <Col span={8}>*/}
          {/*      <Button size='large' className={styles.getCaptcha} onClick={this.onGetCaptcha.bind(this)}>获取验证码</Button>*/}
          {/*    </Col>*/}
          {/*  </Row>*/}
          {/*</Form.Item>*/}
          <Form.Item {...formItemLayout} label={' '} colon={false}>
            <div className={styles.regBtn}>
              <Button size='large'
                      className={styles.submit}
                      onClick={this.onPrev.bind(this)}
                      type="large"
              >
                上一步
              </Button>
              <Button size='large'
                      className={styles.submit}
                      onClick={this.onValidateForm.bind(this)}
                      type="primary"
                      htmlType="submit"
              >
                下一步
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Fragment>
    );
  }

}

export default Step2;

