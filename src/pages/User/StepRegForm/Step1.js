import React, { Fragment, Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, DatePicker, message,Icon } from 'antd';

import { assign, find, isEmpty, map } from 'lodash';
import router from 'umi/router';
import styles from '../Register.less';
import { comboTypes } from '@/globalConfig';
import ObjectBox from '/common/componentsTpl/ObjectBox';
import { findCurrency } from '@/services/global';
import { validateCorpCode, validateHost } from '@/services/login';

const { Option } = Select;
const { MonthPicker } = DatePicker;

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
  // currencys: global[comboTypes.CURRENCY_IDENTITY],
  solutions: global.solution,
}))
@Form.create()
class Step1 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currencyList: [],
      domainName: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    let storageDomainName = localStorage.getItem('domainName') || '';
    this.setState({
      domainName: storageDomainName.substr(storageDomainName.indexOf('.',storageDomainName.indexOf('.')+1)),
    });
    // dispatch({
    //   type: 'global/findByCode',
    //   payload: { code: comboTypes.CURRENCY_IDENTITY },
    // });

    dispatch({
      type: 'global/findSolution',
    });

    findCurrency().then(rsp => {
      if (rsp && (200 === rsp.status || 1 === rsp.status)) {
        this.setState({ currencyList: rsp.data });
      } else {
        message.error('【单位币种】获取失败，请稍后重试');
      }
    });
  }

  //选择账套启动年月
  onChange = (date, dateString) => {
  };

  render() {
    const { form, dispatch, data, solutions } = this.props;
    const { currencyList } = this.state;
    const { getFieldDecorator, validateFields } = form;
    const onPrev = () => {
      //清空表单信息
      dispatch({
        type: 'login/saveStepFormData',
        payload: {},
      });
      router.push('/user/login');
    };

    const onValidateForm = () => {
      // router.push('/user/register/regInfo');`
      // return;
      validateFields((err, values) => {
        if (!err) {
          var tempVal = !isEmpty(data) ? assign(data, values) : values;
          console.log(values);
          dispatch({
            type: 'login/saveStepFormData',
            payload: tempVal,
          });
          localStorage.setItem('userDomainName', values.domainName + this.state.domainName);
          router.push('/user/register/regInfo');
        }
      });
    };

    // 默认币种
    let initialCurrency = !isEmpty(data.currency) ? data.currency : null;
    if (isEmpty(initialCurrency) && !isEmpty(currencyList)) {
      initialCurrency = find(currencyList, (v) => (v && v.code === 'RMB'));
    }

    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm}>
          <Form.Item {...formItemLayout} label="解决方案">
            {getFieldDecorator('solution', {
              initialValue: data.solution,
              rules: [{ required: true, message: '请选择解决方案' }],
            })(
              <Select placeholder="请选择" showSearch size='large'>
                {
                  map(solutions, (o) => {
                    return (
                      <Option value={o.code} key={`solution_${o.id}`}>{o.name}</Option>
                    );
                  })
                }
              </Select>,
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="单位名称">
            {getFieldDecorator('enterpriseName', {
              initialValue: data.enterpriseName,
              rules: [{ required: true, message: '请输入单位名称' }],
            })(<Input placeholder="请输入单位名称" size='large'/>)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="单位本币">
            {getFieldDecorator('currency', {
              initialValue: initialCurrency,
              rules: [{ required: true, message: '请选择单位本币' }],
            })(
              <ObjectBox compData={currencyList} renderItem={(obj) => (obj ? obj.name : '')}/>,
            )}
          </Form.Item>

          <Form.Item {...formItemLayout} label="站点域名">
            {getFieldDecorator('domainName', {
              initialValue: data.domainName,
              validateFirst: true,
              validateTrigger: 'onBlur',
              rules: [
                { required: true, message: '请输入站点域名' },
                {
                  validator: async (rule, value, callback) => {
                    // 判断域名是否可用
                    let host = `${value}${this.state.domainName}`;
                    let res = await validateHost({ host });
                    // console.log('canPhoneRegister', canPhoneRegister);
                    if (res && !res.data) {
                      callback('该域名已被使用');
                    } else {
                      callback();
                    }
                  },
                },
              ],
            })(<Input size='large' placeholder="请输入站点域名" addonAfter={<div>{`${this.state.domainName} `}<Icon type='global' style={{color:' rgba(0, 0, 0, 0.25)'} }/></div>}/>)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="账套启动年月">
            {getFieldDecorator('asStartDate', {
              initialValue: data.asStartDate,
              rules: [{ required: true, message: '请选择账套启动年月' }],
            })(<MonthPicker size='large' onChange={this.onChange}
                            sytle={{ width: '100%' }}
                            placeholder="请选择账套启动年月"/>)}
          </Form.Item>
          <Form.Item {...formItemLayout} label={' '} colon={false}>
            <div className={styles.regBtn}>
              <Button size='large'
                      className={styles.submit}
                      onClick={onPrev}
                      type="large"
              >
                返回登录
              </Button>
              <Button size='large'
                      className={styles.submit}
                      type="primary"
                      onClick={onValidateForm}
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

export default Step1;

