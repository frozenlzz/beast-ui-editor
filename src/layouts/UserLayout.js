import React, { Component, Fragment } from 'react';
//import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import Link from 'umi/link';
import { Icon, LocaleProvider } from 'antd';
import GlobalFooter from '/common/components/GlobalFooter';
// import DocumentTitle from 'react-document-title';
import styles from './UserLayout.less';
import logo from '../assets/svg/logo.svg';
import { getStorage } from '/common/utils/utils';
// import getPageTitle from '/common/utils/getPageTitle';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { isEmpty } from 'lodash';

moment.locale('zh-cn');

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright"/> 2019
  </Fragment>
);



class UserLayout extends Component {
  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });
    // 标识是不是在 “iframe"里面
    let isIframe = 'LOGIN' === getStorage('IFRAME_APP');
    if (isIframe) {
      document.getElementsByTagName('html')[0].style.minWidth = 'auto';
    }
  }

  componentDidUpdate(prevProps, prevState) {

    if (!isEmpty(getStorage('IFRAME_APP')) && window.parent && window.parent.iframeUriChanged) {
      window.parent.iframeUriChanged(this.props.location.pathname);
    }
  }

  render() {
    const {
      children,
      login,
      location: { pathname },
      breadcrumbNameMap,
    } = this.props;
    // 标识是不是在 “iframe"里面
    let enterpriseName;
    if (!isEmpty(login) && !isEmpty(login.corpInfo)) {
      enterpriseName = login.corpInfo.enterpriseName;
    }
    let isIframe = 'LOGIN' === getStorage('IFRAME_APP');
    const childBox = (
      <LocaleProvider locale={zh_CN}>
        <div className={styles.childrenContainer} style={isIframe ? { margin: 0, width: '100%' } : {}}>
          {children}
        </div>
      </LocaleProvider>
    );

    if (isIframe) { // 如果是在 iframe 里，则只显示登录框
      return childBox;
    }

    return (
      <div className={styles.container}>
        <div className={styles.banner}>
          <div className={styles.container_inner} style={{ position: 'relative' }}>
            {/*<a href={'https://www.jianhui.com'} className={styles.logo} >*/}
            {/*  <img src={logo} />*/}
            {/*  <div className={styles.logo_content}> All For Customer</div>*/}
            {/*</a>*/}
            {/*<a className={styles.backIndex} href={'https://www.jianhui.com'}>返回首页</a>*/}
            <div className={styles.banner_content}>
              <div className={styles.banner_content_title}>{enterpriseName}</div>
              <div className={styles.banner_content_content}>人体肤质测评管理系统</div>
            </div>
          </div>
        </div>
        <div className={styles.container_inner}>

          <div className={styles.content}>
            {/*<div className={styles.top}>*/}
            {/*  <div className={styles.header}>*/}
            {/*    <Link to="/">*/}
            {/*      <img alt="logo" className={styles.logo} src={logo} />*/}
            {/*      <span className={styles.title}>Easycon Saas</span>*/}
            {/*    </Link>*/}
            {/*  </div>*/}
            {/*  <div className={styles.desc}>Easycon Saas 是一款移动互联网综合性财税服务平台</div>*/}
            {/*</div>*/}
            <LocaleProvider locale={zh_CN}>
              <div className={styles.childrenContainer}>
                {children}
              </div>
            </LocaleProvider>
          </div>
          <GlobalFooter copyright={copyright}/>
        </div>

      </div>
      // <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
      // </DocumentTitle>
    );
  }
}

export default connect(({ login }) => ({
  login,
}))(UserLayout);
