import React, { Component, Fragment } from 'react';
import { Steps } from 'antd';
import styles from './Register.less';
import { setStorage } from '/common/utils/utils';
import { findCorpInfo } from '@/services/global';

const Step = Steps.Step;

class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      domainName: '',
    };
  }

  getCurrentStep = () => {
    const { location } = this.props;
    const pathList = location.pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'regScheme':
        return 0;
      case 'regInfo':
        return 1;
      case 'regResult':
        return 2;
      default:
        return 0;
    }
  };

  componentDidMount() {
    this.getDomainName();
  }

  // 获取domainName
  getDomainName() {

    findCorpInfo().then(
      res => {
        if (res && res.data) {
          localStorage.setItem('domainName', res.data.domainName);
          this.setState({
            domainName: res.data.domainName,
          });
        }
      },
    );
  }


  render() {
    const { children } = this.props;
    return (
      this.state.domainName ?

        <div className={styles.main} key={this.state.domainName}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="选择方案"/>
              <Step title="完善信息"/>
              <Step title="注册完成"/>
            </Steps>
            {children}
          </Fragment>
        </div> : null
    );
  }
}

export default RegisterPage;
