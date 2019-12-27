import { formatMessage } from 'umi-plugin-locale';
import zh_cn from '@/locales/zh-CN';
import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';
import { recursiveFind } from '@/utils/ArrayUtils';
import { suffix } from '@/defaultSettings';
import { getStorage, setStorage } from '@/utils/utils';

export const LOCALE_FORMAT_KEY = 'LOCALE_FORMAT_KEY';

/**
 * 判断 key 是否有配置国际化
 * @param key
 */
export function hadLocale(key) {
  return zh_cn.hasOwnProperty(key);
}

export function myFormatMessage(desc, values = {}) {
  let params = {};
  if (isString(desc)) {
    params.id = desc;
  } else {
    params = desc;
  }

  for (let k in values) {
    if (values.hasOwnProperty(k) && isString(values[k])) {
      values[k] = formatMsgByCn(values[k]);
    }
  }

  return formatMessage(params, values);
}

export function formatReqTips(desc = {}) {
  try {
    let lang = localStorage.getItem('umi_locale');
    if ('null' === lang || lang.indexOf('zh-CN') != -1) {
      return desc;
    } else {
      return 'The Filed Is Required!';
    }
  } catch (e) {

  }
  return desc;
}


export function formatMsgByCn(cn, values = {}) {
  // console.log('formatMsgByCn cn',cn)
  if (!isString(cn)) return cn;

  if (isEmpty(cn)) {
    return '';
  }
  let formatKey = '';
  let tmpObj = getStorage(LOCALE_FORMAT_KEY) || {};

  if (isEmpty(values) && tmpObj && tmpObj[cn]) {
    formatKey = tmpObj[cn];

  } else {

    for (let k in zh_cn) {

      if (zh_cn.hasOwnProperty(k)) {

        if (zh_cn[k] === cn) {
          formatKey = k;
          tmpObj[cn] = k;
          break;
        }
      }
    }
    setStorage(LOCALE_FORMAT_KEY, tmpObj);
  }

  for (let k in values) {
    if (values.hasOwnProperty(k) && isString(values[k])) {
      values[k] = formatMsgByCn(values[k]);
    }
  }
  // console.log('formatKey',formatKey)
  if (formatKey) {
    return formatMessage({ id: formatKey }, values);
  } else {
    return cn;
  }
}

export function formatLocaleCols(config, columns, distArr) {
  if (config) {
    let appText = formatMsgByCn(config.cn);
// console.log('>>> formatLocaleCols')
    if (!isEmpty(columns)) {
      columns.forEach((colItem, ind) => {
        distArr[ind] = { ...colItem };
        let colField = colItem['dataIndex'] || colItem['key'];
        let configFormatKey = `${config.modelName}.field.${colField}`;
        let globalFormatKey = `global.field.${colField}`;
        let formatTxt = '';
        if (zh_cn.hasOwnProperty(configFormatKey)) {
          formatTxt = myFormatMessage(configFormatKey, { name: appText });
        } else if (zh_cn.hasOwnProperty(globalFormatKey)) {
          formatTxt = myFormatMessage(globalFormatKey, { name: appText });
        } else if (colItem.title) {
          formatTxt = formatMsgByCn(colItem.title);
        }
        distArr[ind].title = formatTxt;
      });
    }
  }
}

export function formatLocaleBreadcrumb(breadcrumbList) {
  return breadcrumbList ?
    breadcrumbList.map((bItem) => (
      { title: formatMsgByCn(bItem.title) }
    )) : [];
}

/**
 * 根据路由信息设置“页面标题”的国际化
 * @param pathname 当前路由
 * @param routes 路由数组
 */
export function formatLocaleDocTitle(pathname, routes) {
  // console.log('sss');
  const route = recursiveFind(routes, (route) => {
    // console.log(route)
    return (isEmpty(route.routes) && isString(route.path) && 0 === route.path.indexOf(pathname));
  }, 'routes');
  if (route && route.title) {
    let splitArr = route.title.split('-');
    if (isString(splitArr[0])) {
      document.title = `${formatMsgByCn(trim(splitArr[0]))} - ${suffix}`;
    }
  }
}
