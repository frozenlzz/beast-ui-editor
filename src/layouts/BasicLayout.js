import React, { Component } from 'react';
import { Button, Drawer, Layout, LocaleProvider, Skeleton, Spin } from 'antd';
import Media from 'react-media';
import { connect } from 'dva';
// import SiderMenu from '/common/components/SiderMenu';
import SiderMenu from '@/components/SiderMenu';
// import logo from '../assets/svg/logo.svg';
import logo from '../assets/LOGO.png';
import Footer from './Footer';
import Header from './Header';
import styles from './BasicLayout.less';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import menuJson from '@/menu';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { isEmpty, isObject, cloneDeep, isString } from 'lodash';
import { dealAuthMenu } from '/common/components/SiderMenu/SiderMenuUtils';
import { getRandomKey, isObjectValEqual, removeStorage, setStorage } from '/common/utils/utils';
import { getAuthConfigByPathname, getConfigByPathname, isAuthByConfig } from '@/appConfig';
import router from 'umi/router';
import ModalComp from '/common/components/ModalItem/ModalComp';
window.confirmRgba=false;
moment.locale('zh-cn');

class BasicLayout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      iframeVisible: false, // iframe 弹框是否弹出
      iframeLoading: false, // iframe 弹框是否 loading
      iframeSetting: { // iframe 弹框的设置项
        title: '', // iframe 弹框的 title
        url: '', // iframe 的 src
      },
      iframeH: 400
    };
    // 根据当前用户权限，过滤菜单
    this.updateMenuJson();

    // 将 dispatch 方法放到当前 window 中，使得在任何地方都可以 dispatch(action)
    window.dvaDispatch = this.props.dispatch;
    let $this = this;
    window.iframeUriChanged = (uri) => {
      // console.log('iframeUriChanged', uri);
      if (isString(uri) && -1 !== uri.indexOf('authorLogin') && 500 !== $this.state.iframeH) {
        $this.setState({
          iframeH: 500
        });
      } else if(400 !== $this.state.iframeH) {
        $this.setState({
          iframeH: 400
        });
      }
    };
  }

  componentDidMount() {
    this.updateAppCode();
    const { dispatch } = this.props;
    dispatch({
      type: 'setting/getSetting',
    });
    // 获取当前用户信息
    dispatch({
      type: 'global/findSelfInfo',
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // 页面切换之后，更新当前页面 appCode 并检查权限
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.updateAppCode();
    }

    // 用户信息变化，强制重新渲染
    if (!isObjectValEqual(prevProps.userInfo, this.props.userInfo)) {
      this.updateMenuJson();
      this.setState({ randomKey: getRandomKey() });
    }

    // 如果登录过期，弹出 iframe 用于重新登录
    if (false === prevProps.loginTimeout && this.props.loginTimeout) {
      this.showIframe({
        title: '',
        url: `${window.location.origin}${window.location.pathname}#/user`,
      }, 'LOGIN');

    } else if (prevProps.loginTimeout && false === this.props.loginTimeout) {
      // 关闭 iframe
      this.hideIframe();
      // 刷新应用状态数据 `state`
      this.props.dispatch({
        type: 'global/afterLogin',
      });
    }
  }

  iframeLoadingTimer = null;

  /**
   * 打开iframe 弹框
   */
  showIframe(iframeSetting, iframeApp) {
    setStorage('IFRAME_APP', iframeApp);
    this.setState({
      iframeSetting,
      iframeVisible: true,
      iframeLoading: true,
    });

    // iframe 的 loading 效果
    if (this.iframeLoadingTimer) clearTimeout(this.iframeLoadingTimer);
    this.iframeLoadingTimer = setTimeout(() => {
      this.setState({ iframeLoading: false });
    }, 2000);
  }

  /**
   * 关闭 iframe 弹框
   */
  hideIframe() {
    removeStorage('SHOWING_TIMEOUT');
    removeStorage('IFRAME_APP');
    this.setState({ iframeVisible: false, iframeSetting: {} });
  }


  updateMenuJson() {

    // 根据当前用户权限，过滤菜单
    this.menuJson = [menuJson[0]];
    const userInfo = this.props.userInfo || {};
    const userAuthResObj = userInfo.resources;
    // if (!isEmpty(userAuthResObj) && isObject(userAuthResObj)) {
      // 遍历菜单，判断当前用户是否拥有菜单权限
      const menuArr = cloneDeep(menuJson.slice(1));
      dealAuthMenu(menuArr, userAuthResObj);
      this.menuJson = this.menuJson.concat(menuArr);
    // }
  }

  updateAppCode() {
    const pathname = this.props.location.pathname;
    const configObj = getConfigByPathname(pathname) || {};
    this.props.dispatch({
      type: 'global/updateAppCode',
      payload: {
        appCode: configObj.appCode || '',
      },
    });
    // 判断是否含有当前页面的权限
    const authConfig = getAuthConfigByPathname(pathname);
    const userInfo = this.props.userInfo || {};
    if (!isEmpty(authConfig) &&
      !isEmpty(userInfo.resources) &&
      !isAuthByConfig(authConfig, userInfo.resources)) {
      router.replace('/403');
    }
  }

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout, siderWidth } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: `${siderWidth}px`,
      };
    }
    return null;
  };

  //开启/隐藏sider菜单
  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  render() {
    const {
      children,
      navTheme,
      isMobile,
      fixedHeader,
      layout: PropsLayout,
    } = this.props;
    const { Content } = Layout;
    const isTop = PropsLayout === 'topmenu';
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    // console.log('this.menuJson', this.menuJson);

    const layout = (
      <Layout>
        {/* 注释 linzz */}
        {/* {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={this.menuJson}
            isMobile={isMobile}
            {...this.props}
          />
        )} */}
        <Layout
          className={styles['layout-right']}
          style={{
            // ...this.getLayoutStyle(), //注释 linzz
            minHeight: '100vh',
          }}
        >
          {/* 注释 linzz */}
          {/* <Header
            logo={logo}
            handleMenuCollapse={this.handleMenuCollapse.bind(this)}
            {...this.props}
          /> */}
          <Content className={styles.content} style={contentStyle}>
            {children}
          </Content>
          {/* <Footer/> */}
        </Layout>
      </Layout>
    );
    let drawerWidth = 400; // window.document.body.clientWidth < 800 ? 800;
    // let drawerHeight = window.document.body.clientHeight;
    return (
      <LocaleProvider locale={zh_CN}>
        <React.Fragment>
          {layout}

          <ModalComp
            title={this.state.iframeSetting.title}
            width={drawerWidth}
            closable={false}
            visible={this.state.iframeVisible}
            destroyOnClose={true}
            // onCancel={this.hideIframe.bind(this)}
            bodyStyle={{ padding: 0, background: '#ffffff' }}
            footer={null}
          >
            <Spin spinning={this.state.iframeLoading}>
              {
                this.state.iframeSetting.url && (
                  <iframe className={styles.iframe} scrolling={'no'}
                          style={{ height: this.state.iframeH }}
                          src={this.state.iframeSetting.url}/>
                )
              }
            </Spin>

          </ModalComp>
        </React.Fragment>
      </LocaleProvider>
    );
  }
}

export default connect(({ setting, global: { loginTimeout, userInfo, collapsed, siderWidth } }) => ({
  loginTimeout,
  userInfo,
  collapsed,
  siderWidth,
  layout: setting.layout,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile}/>}
  </Media>
));
