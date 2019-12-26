import React, { PureComponent, Suspense } from 'react';
import { Layout } from 'antd';
import classNames from 'classnames';
import Link from 'umi/link';
import styles from './index.less';
import PageLoading from '../PageLoading';
import { getDefaultCollapsedSubMenus, getMenuStrKeys } from './SiderMenuUtils';

const BaseMenu = React.lazy(() => import('./BaseMenu'));
const { Sider } = Layout;
let firstMount = true;

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);

    //被选中的菜单
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
    };
  }

  componentDidMount() {
    //firstMount = false;
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname, flatMenuKeysLen } = state;
    if (props.location.pathname !== pathname || props.flatMenuKeys.length !== flatMenuKeysLen) {
      return {
        pathname: props.location.pathname,
        flatMenuKeysLen: props.flatMenuKeys.length,
        openKeys: getDefaultCollapsedSubMenus(props),
      };
    }
    return null;
  }

  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData.some(item => {
      if (key) {
        let itemKey = getMenuStrKeys(item.key, item.path);
        return itemKey === key || item.path === key;
      }
      return false;
    });
  };

  handleOpenChange = openKeys => {
    if (openKeys) {
      const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
      this.setState({
        openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
      });
    }
  };

  render() {
    const { title, logo, collapsed, siderWidth, onCollapse, fixSiderbar, theme, isMobile } = this.props;
    const { openKeys } = this.state;
    const defaultProps = collapsed ? {} : { openKeys };

    const siderClassName = classNames(styles.sider, {
      [styles.fixSiderBar]: fixSiderbar,
      [styles.light]: theme === 'light',
    });

    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="xl"
        onCollapse={collapse => {
          if (firstMount || !isMobile) {
            onCollapse(collapse);
          }
        }}
        width={200}
        theme={theme}
        className={siderClassName}
      >
        <div className={styles.logo} id="logo">
          <Link to="/">
            <img src={logo} alt="logo"/>
            <h1 style={{
              position: 'absolute',
              top: '18px',
              left: '38px',
              wordWrap: 'break-word',
              lineHeight: '22px'
            }}>{title}</h1>
          </Link>
        </div>
        <Suspense fallback={<PageLoading/>}>
          <BaseMenu
            {...this.props}
            mode="inline"
            handleOpenChange={this.handleOpenChange}
            onOpenChange={this.handleOpenChange}
            style={{ padding: '16px 0', width: !collapsed ? siderWidth + 8 : '100%', marginLeft: !collapsed ? -8 : 0 }}
            {...defaultProps}
          />
        </Suspense>
      </Sider>
    );
  }
}
