import pathToRegexp from 'path-to-regexp';
import { urlToList } from '/common/components/_utils/pathTools';
import { recursiveFind } from '/common/utils/ArrayUtils';
import { getConfigByKeyValue, isAuthByConfig } from '@/appConfig';
import findIndex from 'lodash/findIndex';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import remove from 'lodash/remove';

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menus
 */
export const getFlatMenuKeys = menuData => {
  let keys = [];
  menuData.forEach(item => {
    keys.push(item.key);
    if (item.children) {
      keys = keys.concat(getFlatMenuKeys(item.children));
    }
  });
  // console.log('keys:',keys);
  return keys;
};


export const getMenuStrKeys = (key, path) => {
  if (isArray(key)) {
    // console.log('isArray:',key);
    let ind = findIndex(key, (o) => {
      return o == path;
    });
    if (ind > -1) {
      return key[ind];
    } else {
      return key[0];
    }
  } else {
    return key;
  }
};

export const getMenuMatches = (flatMenuKeys, path) =>
  flatMenuKeys.filter(item => {
    if (item) {
      return pathToRegexp(getMenuStrKeys(item, path)).test(path);
    }
    return false;
  });
/**
 * 获得菜单子节点
 * @memberof SiderMenu
 */
export const getDefaultCollapsedSubMenus = props => {
  const {
    location: { pathname },
    flatMenuKeys,
    menuData,
  } = props;
  let subMenus = [];
  let subMenuObj = recursiveFind([...menuData], (v) => {
    let key = getMenuStrKeys(v.key, pathname);
    return key === pathname;
  });
  if (subMenuObj) {
    subMenuObj['parent'] && (
      subMenus = [...subMenuObj['parent']]
    );
  } else {
    // 打开详情页时
    let subpages = urlToList(pathname);
    if (subpages && subpages.length) {
      if (subpages.length > 1) {
        if (typeof subpages[0] != 'undefined') {
          let sub = recursiveFind([...menuData], (v) => {
            let key = getMenuStrKeys(v.key, pathname);
            return key === subpages[0];
          });
          if (sub && sub['parent']) {
            subMenus = [...sub['parent']];
          }
        }
      }
    }
  }
  return urlToList(pathname)
    .map(item => {
      return getMenuStrKeys(getMenuMatches(flatMenuKeys, item)[0], pathname);
    }).reduce((acc, curr) => [...acc, curr], subMenus);
};


/**
 * 判断当前用户是否有菜单权限
 * @param menuAuthConfig Object 菜单的权限配置
 * @param userAuthResObj Object 用户的权限配置
 * @returns {boolean}
 */
export function isAuthMenuByConfig(menuAuthConfig, userAuthResObj) {
  return isAuthByConfig(menuAuthConfig, userAuthResObj);
}

/**
 * 递归过滤空菜单
 * @param distMenu
 */
export function filterEmptyMenu(distMenu) {
  // 将空菜单移除
  remove(distMenu, (menuItem) => (
    isEmpty(menuItem)
  ));
  // 将空子菜单移除
  distMenu.forEach(menuItem => {
    if (!isEmpty(menuItem.children) && isArray(menuItem.children)) {
      filterEmptyMenu(menuItem.children);
    }
  });
  // 将没有子菜单的父级菜单项移除
  remove(distMenu, (menuItem) => (
    'undefined' === typeof menuItem.path && isEmpty(menuItem.children)
  ));
}

/**
 * 递归处理有权限的菜单
 * @param distMenu
 * @param userAuthResObj
 */
export function dealAuthMenu(distMenu, userAuthResObj) {
  distMenu.forEach((menuItem, menuInd) => {
    if (isEmpty(menuItem)) return;
    // 如果有子菜单，则递归遍历
    if (isArray(menuItem.children)) {
      dealAuthMenu(menuItem.children, userAuthResObj);
    } else {
      // 判断菜单所包含的权限，而当前用户是否至少拥有一种权限

      // 获取菜单的权限配置
      let menuItemAuthConfigs;

      // 如果菜单含有 authConfig ，则以这个配置为主
      if (menuItem.authConfig) {
        menuItemAuthConfigs = menuItem.authConfig;

      } else {// 菜单不含有 authConfig ，则在 appConfig 中根据路由名称来获取权限配置

        if (isArray(menuItem.key)) {
          menuItemAuthConfigs = [];
          menuItem.key.forEach(kItem => {
            if (isString(kItem)) {
              const kStr = kItem.substr(1);
              const configObj = getConfigByKeyValue('modelName', kStr);
              if (configObj && !isEmpty(configObj.authConfig)) {
                menuItemAuthConfigs.push(configObj.authConfig);
              }
            }
          });
        } else if (isString(menuItem.key)) {
          const kStr = menuItem.key.substr(1);
          const configObj = getConfigByKeyValue('modelName', kStr);
          if (configObj && !isEmpty(configObj.authConfig)) {
            menuItemAuthConfigs = configObj.authConfig;
          }
        }
      }

      // 根据菜单的权限配置和当前用户的权限配置，来过滤菜单
      if (isArray(menuItemAuthConfigs)) {
        menuItemAuthConfigs.forEach(menuAuthConfig => {

          // 如果没有此菜单权限，则不显示此菜单，在这里是直接将此菜单剔除菜单数组
          if (!isAuthMenuByConfig(menuAuthConfig, userAuthResObj)) {
            distMenu.splice(menuInd, 1, null);
          }

        });
      } else if (isObject(menuItemAuthConfigs)) {

        // 如果没有此菜单权限，则不显示此菜单，在这里是直接将此菜单剔除菜单数组
        if (!isAuthMenuByConfig(menuItemAuthConfigs, userAuthResObj)) {
          distMenu.splice(menuInd, 1, null);
        }
      }

    }
  });
  // console.log('distMenu', cloneDeep(distMenu));
  filterEmptyMenu(distMenu);

}
