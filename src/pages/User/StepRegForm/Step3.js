import React, { Fragment, Component } from 'react';
import router from 'umi/router';
import { Button } from 'antd';
import { connect } from 'dva';
import Result from '/common/components/Result';
import styles from '../Register.less';
import { findUserCorpByPhone } from '@/services/login';
import { isEmpty } from 'lodash';
import Alert from 'antd/es/alert';

@connect()
class Step3 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userDomainName: window.location.origin,
    };
  }

  componentDidMount() {
    //清空注册信息
    const { dispatch } = this.props;
    dispatch({
      type: 'login/saveStepFormData',
      payload: {},
    });
  }

  onAuthor = () => {
    router.push('/user/authorLogin');
  };

  render() {
    return (
      <Result
        type="success"
        title={'注册成功'}
        // description={'绑定QQ与微信登录,更方便、更快捷!'}
        style={{ marginTop: 48, marginBottom: 16 }}
        actions={(<div className={styles.regBtn}>
          <Alert
            message={(
              <>
              请记住您的登录域名: <b className={'ml8 text-danger'}>{this.state.userDomainName}</b>
              </>
            )}
            type="error"
            style={{ marginBottom: '20px' }}
          />
          <Button size='large'
                  className={styles.submit}
                  onClick={() => {
                    router.push('/user/login');
                  }}
                  type="primary"
          >
            立即登录
          </Button>
          {/*<Button size='large'*/}
          {/*        className={styles.submit}*/}
          {/*        onClick={onAuthor}*/}
          {/*        type="primary"*/}
          {/*        htmlType="submit"*/}
          {/*>*/}
          {/*  继续绑定*/}
          {/*</Button>*/}
        </div>)}
      />
    );

  }

}

export default Step3;

