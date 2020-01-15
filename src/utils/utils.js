import moment from 'dayjs';
import React from 'react';
import omit from 'lodash-es/omit';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import isObject from 'lodash-es/isObject';
import forEach from 'lodash-es/forEach';
import isArray from 'lodash-es/isArray';
// import keys from 'lodash-es/keys';
import functionsIn from 'lodash-es/functionsIn';
import { parse, stringify } from 'qs';
import { isNumber, pick, trim } from 'lodash-es';
import router from 'umi/router';

export function urlEncode(param) {
  let paramStr = urlEncodeFunc(param);
  if (!isEmpty(paramStr)) {
    paramStr = trim(paramStr, '&');
  }
  return paramStr;
}

function urlEncodeFunc(param, key) {
  if (param == null) return '';
  let paramStr = '';
  let t = typeof (param);
  if (t === 'string' || t === 'number' || t === 'boolean') {
    // let val = isObject(param) ? '[]' : param;
    paramStr += encodeURIComponent(key) + '=' + encodeURIComponent(param) + '&';
  } else {
    for (let i in param) {
      // let k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      let k = key == null ? i : key + '[' + i + ']';
      paramStr += urlEncodeFunc(param[i], k);
    }
  }
  return paramStr;
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getFromObjByKeys(srcO, keys) {

  if (!isObject(srcO)) {
    return false;
  }
  var o = {};

  forEach(keys, function(item) {

    if ('undefined' != typeof srcO[item]) {
      o[item] = srcO[item];
    }
  });
  return o;
}

/**
 * 判断对象是否含有空值
 * @param obj Object 待判断的对象
 * @param keyArray Array 指定需要做判断的属性，不指定，则默认判断所有属性是否为空
 * @returns {boolean}
 */
export function isObjectHadEmpty(obj, keyArray) {
  if (isEmpty(obj)) return true;

  let hadEmp = false;
  let tmpO = isArray(keyArray) && !isEmpty(keyArray) ? pick(obj, keyArray) : obj;

  for (let key in tmpO) {
    const val = tmpO[key];

    if (isValEmpty(val)) {
      hadEmp = true;
      break;
    }
  }
  return hadEmp;
}


export function isValEmpty(val) {
  return ((isNumber(val) && 0 === val) || (!isNumber(val) && isEmpty(val)));
}

/**
 * 判断对象 v 的值是否都为空
 * @returns {boolean}
 * @param obj
 */
export const isObjectValueEmpty = (obj) => {
  if (isEmpty(obj)) return true;

  let isEmp = true;

  for (let key in obj) {
    const val = obj[key];

    if (!isValEmpty(val)) {
      isEmp = false;
      break;
    }
  }
  return isEmp;
};


/**
 * 对比两个对象的值是否相等（只支持基础数据类型的比较）
 */
export function isObjectValEqual(srcObj, othObj, needCheckAttrs = null) {

  if (isArray(needCheckAttrs) && 0 < needCheckAttrs.length) {
    return isEqual(
      getFromObjByKeys(omit(srcObj, functionsIn(srcObj)), needCheckAttrs),
      getFromObjByKeys(omit(othObj, functionsIn(othObj)), needCheckAttrs),
    );
  } else {
    return isEqual(omit(srcObj, functionsIn(srcObj)), omit(othObj, functionsIn(othObj)));
  }
}

/**
 * 将 datetime（YYYY-MM-DD HH:mm:ss） 转成 date（YYYY-MM-DD）
 * @param datetime
 * @returns {string}
 */
export function datetime2Date(datetime) {
  let date = moment(datetime, 'YYYY-MM-DD HH:mm:ss');
  if (date.isValid()) {
    return date.format('YYYY-MM-DD');
  } else {
    return '';
  }
}

export const myFormatTime = function(timestamp, format = '') {
  if (null == format || '' == trim(format)) {
    format = 'yyyy-MM-dd hh:mm:ss';
  }
  if (!window.myFormatDate || typeof window.myFormatDate == 'undefined') {
    window.myFormatDate = new Date();
  }
  return window.myFormatDate.format(format, timestamp);
};

Date.prototype.format = function(format, timestamp) {
  var tempDate;

  if (timestamp && timestamp > 0) {
    if (timestamp > 9999999999) {
      tempDate = new Date(timestamp);
    } else {
      tempDate = new Date(timestamp * 1000);
    }
  } else {
    tempDate = this;
  }
  var date = {
    'M+': tempDate.getMonth() + 1,
    'd+': tempDate.getDate(),
    'h+': padLeft(tempDate.getHours().toString(), 2),
    'm+': padLeft(tempDate.getMinutes().toString(), 2),
    's+': padLeft(tempDate.getSeconds().toString(), 2),
    'q+': Math.floor((tempDate.getMonth() + 3) / 3),
    'S+': tempDate.getMilliseconds(),
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (tempDate.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
        ? date[k] : ('00' + date[k]).substr(('' + date[k]).length));
    }
  }
  return format;
};
const padLeft = (str, length) => {
  if (str.length >= length)
    return str;
  else
    return padLeft('0' + str, length);
};

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}


function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path,
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function isIE() {
  return /Edge/.test(window.navigator.userAgent) || 'ActiveXObject' in window || !!window.ActiveXObject;
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

export const importCDN = (url, name) =>
  new Promise(resolve => {
    const dom = document.createElement('script');
    dom.src = url;
    dom.type = 'text/javascript';
    dom.onload = () => {
      resolve(window[name]);
    };
    document.head.appendChild(dom);
  });

export const sleepFunc = (millisecond, params) => {
  // console.log(millisecond, params);
  return new Promise(function(resolve, reject) {
    window.setTimeout(function() {
      resolve(params);
    }, millisecond);
  }).catch((e) => {
    console.error('sleepFunc', e);
  });
};


export function loadScript(url, callback, bakURLs = []) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = 'async';
  script.src = url;
  document.body.appendChild(script);
  if (script.readyState) {   //IE
    script.onreadystatechange = function() {
      console.log('script.readyState', script.readyState);
      if (script.readyState == 'complete' || script.readyState == 'loaded') {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {    //非IE
    script.onload = function() {
      callback();
    };
    script.onerror = function(e) {
      console.log('>>> error', e);
      if (isArray(bakURLs) && !isEmpty(bakURLs)) {
        // 备用的链接
        let bakUrl = bakURLs.shift();
        loadScript(bakUrl, callback, bakURLs);
      }
    };
  }
}

export function jsGetDPI() {
  var arrDPI = new Array();
  if (window.screen.deviceXDPI != undefined) {
    arrDPI[0] = window.screen.deviceXDPI;
    arrDPI[1] = window.screen.deviceYDPI;
  } else {
    var tmpNode = document.createElement('DIV');
    tmpNode.style.cssText = 'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden';
    document.body.appendChild(tmpNode);
    arrDPI[0] = parseInt(tmpNode.offsetWidth);
    arrDPI[1] = parseInt(tmpNode.offsetHeight);
    tmpNode.parentNode.removeChild(tmpNode);
  }
  return arrDPI;
}

/**
 * 生成随机的 key
 * @returns {number}
 */
export const getRandomKey = () => {
  // return Math.floor(+new Date() - Math.random() * 100000);
  return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5);
};

export const getGID = () => {
  var s = [];
  var hexDigits = '0123456789qwertyuiopasdfghjklzxcvbnm';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[20];

  return s.join('');
};

export const setStorage = (key, val) => {
  window.localStorage.setItem(key, JSON.stringify(val));
};

export const getStorage = (key) => {
  let reVal = null;
  try {
    reVal = JSON.parse(window.localStorage.getItem(key));
  } catch (e) {
    reVal = window.localStorage.getItem(key) || null;
    // console.log('getStorage', e);
  }
  return reVal;
};

export const removeStorage = (key) => {
  window.localStorage.removeItem(key);
};

export const clearStorage = () => {
  // let umiLocale = getStorage('umi_locale');
  // window.localStorage.clear();
  // setStorage('umi_locale', umiLocale);
  window.localStorage.removeItem('accountInfo');
  window.localStorage.removeItem('userInfo');
};

export const getUserInfo = () => {
  const userInfo = getStorage('userInfo');
  if (null === userInfo) {
    clearStorage();
    router.push('/user');
  }
  return userInfo;
};
