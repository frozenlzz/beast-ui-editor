import React, { PureComponent } from 'react';
import pathToRegexp from 'path-to-regexp';
import classNames from 'classnames';
import { Menu, Icon } from 'antd';
import Link from 'umi/link';
import { urlToList } from '/common/components/_utils/pathTools';
import { getMenuMatches, getMenuStrKeys } from './SiderMenuUtils';
import { isUrl } from '/common/utils/utils';
import styles from './index.less';
import IconFont from '/common/components/IconFont';
import { recursiveFind } from '/common/utils/ArrayUtils';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'icon-geren' #For Iconfont ,
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string') {
    if (isUrl(icon)) {
      return <Icon component={() => <img src={icon} alt="icon" className={styles.icon}/>}/>;
    }
    if (icon.startsWith('icon-')) {
      return <IconFont type={icon}/>;
    }
    return <Icon type={icon}/>;
  }
  return icon;
};

export default class BaseMenu extends PureComponent {


  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = menusData => {
    if (!menusData) {
      return [];
    }
    let result = menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => this.getSubMenuOrItem(item))
      .filter(item => item);
    return result;
  };

  // Get the currently selected menu
  /**
   * 获取当前选中的菜单
   * @param pathname
   * @returns {Array|*}
   */
  getSelectedMenuKeys = pathname => {
    const { flatMenuKeys, menuData } = this.props;
    // console.log('f:',flatMenuKeys);
    //带参数的详情页
    let match = pathToRegexp(/^\/\w+\/\w+\/((?:[^\/]+?))(?:\/(?=$))?$/i).exec(pathname);
    let menuKey = '';
    if (match) {
      let tempList = urlToList(pathname);
      menuKey = tempList.length > 2 ? [...tempList][1] : '';
    } else {
      menuKey = pathname;
    }
    let subMenuObj = recursiveFind([...menuData], (v) => {
      return getMenuStrKeys(v.key, pathname) === menuKey;
    });
    let result = [];
    //编辑页面是否为一级页面
    if (subMenuObj && (subMenuObj.isSiblings && subMenuObj.isSiblings === true)) {
      result = getMenuMatches(flatMenuKeys, menuKey);
    } else {

      result = urlToList(menuKey).map(itemPath => {
        let temp = getMenuMatches(flatMenuKeys, itemPath).pop();
        if (isArray(temp)) {
          return getMenuStrKeys(temp, pathname);
        } else {
          return temp;
        }
      });
      // console.log('result:',result);
    }
    if (result && !isEmpty(result)) {
      return result;
    } else {
      return [];
    }
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    const {
      location: { pathname },
    } = this.props;

    let menuKey = getMenuStrKeys(item.key, pathname);
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      const { name } = item;
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{name}</span>
              </span>
            ) : (
              name
            )
          }
          key={menuKey}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item className={'hover-wrap'} key={menuKey}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const { name } = item;
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    const { location, isMobile, onCollapse } = this.props;
    return (
      <>
        <Link
          to={itemPath}
          target={target}
          replace={itemPath === location.pathname}
          onClick={
            isMobile
              ? () => {
                onCollapse(true);
              }
              : undefined
          }
        >
          {icon}
          <span>{name}</span>
        </Link>
        <a style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 40,
          textAlign: 'center',
          fontSize: 18
        }} className={'hover-show'} href={`./#${itemPath}`} target={'_blank'} title={'新标签打开'} ><Icon type="block" /></a>
      </>
    );
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  render() {
    const {
      openKeys, theme, mode,
      location: { pathname },
      className, collapsed,
    } = this.props;
    let selectedKeys = this.getSelectedMenuKeys(pathname);
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let props = {};
    if (openKeys && !collapsed) {
      props = {
        openKeys: openKeys.length === 0 ? [...selectedKeys] : openKeys,
      };
    }
    const { handleOpenChange, style, menuData } = this.props;
    const cls = classNames(className, {
      'top-nav-menu': mode === 'horizontal',
    });
    // console.log('selectedKeys:',selectedKeys);
    return (
      <Menu
        key="Menu"
        mode={mode}
        theme={theme}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        style={style}
        className={cls}
        {...props}
      >
        {this.getNavMenuItems(menuData)}
      </Menu>
    );
  }
}
