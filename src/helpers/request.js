/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { message, Modal } from 'antd';
import { assign, omit, isFunction, isObject, isString, isEmpty } from 'lodash-es';
import { clearStorage, getRandomKey, getStorage, removeStorage, setStorage, urlEncode } from '@/utils/utils';
import router from 'umi/router';
import { logout } from '@/apiConfig';
import { hadLocale, myFormatMessage } from '@/utils/localeUtils';

const codeMessage = {
  200: '操作成功',
  201: '操作失败',
  202: '处理中，请稍后',
  204: '操作成功，请手动刷新',
  400: '访问失败，请联系管理员-400',
  401: '没有权限',
  403: '访问受限',
  404: '页面不存在',
  405: '访问受限，请联系管理-405',
  406: '访问受限，请联系管理员-406',
  409: '访问受限，请联系管理员-409',
  410: '请求的资源被永久删除',
  415: '请求的资源类型不支持',
  422: '访问受限，请联系管理员-422',
  429: '操作过于频繁',
  500: '访问受限，请联系管理员-500',
  510: '访问受限，请联系管理员-510',
  502: '访问受限，请联系管理员-502',
  503: '系统维护中...',
  504: '网络信号较差，访问超时',
};

/**
 * 请求超时时间5分钟
 * @type {number}
 */
const reqTimeOut = (1000 * 60) * 5;
// const  reqTimeOut = 500;

/**
 * 异常处理程序
 */
const errorHandler = (error, rep, body) => {
  // console.log('errorHandler', error, rep, body);
  if (error && error.message && -1 !== error.message.indexOf('timeout')) {
    // '请求超时，稍后再试'
    message.error(myFormatMessage('504'));
    return null;
  }

  const { response, data } = error;
  // console.log('error response data', error.response, data);
  // let errmsg = '';
  // if(!rep){
  //   message.warning('请求超时,稍后再试');
  // }
  if (data && data.states && data.states.message) {
    message.error(data.states.message, 2);

  } else if (response) {
    // const errorText = codeMessage[response.status] || response.statusText;
    const errorText = hadLocale(response.status) ? myFormatMessage(`${response.status}`) : (codeMessage[response.status] || response.statusText);
    // const { status } = response;
    message.error(`${myFormatMessage('global.request.fail')}: ${errorText}`, 2);
  }
  return data;
};

export const isLogin = (res, showTip = true) => {
  let rspData = res ? res.data : null;
  let noLogined = rspData && 'undefined' !== typeof rspData.isAuthenticated
    && !rspData.isAuthenticated
    && 'Login Failure' === rspData.detailMessage;

  if (!isEmpty(res) && res.response && res.response.headers) {
    const token = res.response.headers.get('TOKEN');
    // console.log('>>> token', token);
    if (isEmpty(token)) {
      noLogined = true;
    }
  }
  //
  // if (isEmpty(res)) {
  //   const token = getCookie('TOKEN');
  //   // console.log('>>> token', token);
  //   if (isEmpty(token)) {
  //     noLogined = true;
  //   }
  // }

  if (showTip) {
    let isShowingTimeout = getStorage('SHOWING_TIMEOUT'); // 用于避免多次弹出“登录过期”弹框

    if (noLogined && 1 != isShowingTimeout && -1 === window.location.href.indexOf('/user/')) {
      clearStorage();
      // 缓存当前页面路由，由于项目用的是 hash 路由，所以就直接截取了页面 URL 的 hash 部分
      setStorage('TIMEOUT_ROUTE', window.location.hash.substr(1));
      // 标识已经弹出“登录过期提示框”，避免重复弹出
      setStorage('SHOWING_TIMEOUT', 1);
      // hadWarn = 1;
      Modal.warning({
        title: myFormatMessage('global.login.timeout'),
        content: myFormatMessage('global.login.timeout.tip'),
        maskClosable: false,
        closable: false,
        keyboard: false,
        centered: true,
        zIndex: 99999,
        onOk: () => {
          // 通过 `window.dvaDispatch(action)` 弹出 [登录页的 `iframe` 弹框] ，等待重新登录
          if (isFunction(window.dvaDispatch)) {
            window.dvaDispatch({
              type: 'global/loginTimeout',
              payload: true,
            });
          } else {
            removeStorage('SHOWING_TIMEOUT');
            router.replace('/user');
          }
        },
      });
    }
  } else {
    return !noLogined;
  }

};

export const failHandler = response => {
  if (isObject(response) && 'undefined' !== typeof response.status) {
    if (200 !== response.status) {
      const errMsg = isString(response.data) && !isEmpty(response.data) ? response.data :
        response.msg ? response.msg : `${myFormatMessage('global.request.fail')}:${response.status}`;
      message.error(errMsg);
    }
  }
  return response;
};


/**
 * 配置request请求时的默认参数
 */
const request = extend({
  // prefix: process.env.apiPrefix,
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  getResponse: true,
});

const requestPool = {};
window.fetchingCnt = 0;


/**
 * get 请求
 * @param api api 地址
 * @param params （可选）参数
 * @param options （可选）request 的 options
 * @returns {Promise<any>}
 */
export const reqGet = (api, params = {}, options = {}) => {
  if (isEmpty(api)) {
    return new Promise((resolve) => {
      resolve();
    });
  }
  let randomKey = getRandomKey();
  requestPool[randomKey] = {
    func: _reqFunc(api, params, options, randomKey),
    fetching: false,
  };
  // reqTimeOut(randomKey);
  return _reqFunc(api, params, options, randomKey)();

};

function _reqFunc(api, params, options, randomKey) {
  // console.log('requestPool:',requestPool);
  return function() {

    let hide;
    if (true === params.needLoading) {
      hide = message.loading(myFormatMessage('global.request.loading'), 0);
    }

    window.fetchingCnt++;
    return request.get(api, {
      headers: { Accept: 'application/json;charset=UTF-8' },
      params: {
        ...omit(params, ['signal', 'needLoading']),
        locale: 'en-US' !== window.localStorage.getItem('umi_locale') ? 'zh' : 'en', // 加上国际化参数
      },
      timeout: reqTimeOut,
      ...assign({ signal: params.signal }, options),
    }).then((res) => {
      // console.log('res', res)
      window.fetchingCnt--;
      delete requestPool[randomKey];
      // console.log('>>>requestPool', window.fetchingCnt, requestPool);

      if (isObject(res) && res.data && 'undefined' !== typeof res.data.status && params.signal) {
        params.signal.noAbort = true;
      }
      isFunction(hide) && hide();
      // 如果没有登陆，则跳转到登录页
      isLogin(res);

      return res ? res.data : null;
    }).catch(e => {
      console.error('e', e);
    });
  };

}

/**
 * post 提交 json 数据，Content-type=application/json
 * @param api String api 地址
 * @param data Object 提交数据对象
 * @param options Object （可选）request 的 options
 * @returns {Promise<any>}
 */
export const jsonPost = (api, data = {}, options = {}) => {

  if (isEmpty(api)) {
    return new Promise((resolve) => {
      resolve();
    });
  }

  let hide;
  if (true === data.needLoading) {
    hide = message.loading(myFormatMessage('global.request.loading'), 0);
  }

  window.fetchingCnt++;
  return request(api, {
    method: 'post',
    timeout: reqTimeOut,
    // requestType: 'form',
    data: {
      ...omit(data, ['signal', 'noLoading']),
      locale: 'en-US' !== window.localStorage.getItem('umi_locale') ? 'zh' : 'en', // 加上国际化参数
    },
    ...assign({ signal: data.signal }, options),
  }).then((res) => {
    window.fetchingCnt--;
    if (isObject(res) && res.data && 'undefined' !== typeof res.data.status && data.signal) {
      data.signal.noAbort = true;
    }
    isFunction(hide) && hide();
    if (api !== logout) {
      // 如果没有登陆，则跳转到登录页
      isLogin(res);
    }
    return res ? res.data : null;
  }).catch(e => {
    console.error('e', e);
  });
};

/**
 * post 提交 Form Data 数据，Content-type=application/x-www-form-urlencoded
 * @param api String api 地址
 * @param data Object 提交数据对象
 * @param options Object （可选）request 的 options
 * @returns {Promise<any>}
 */
export const formPost = (api, data = {}, options = {}) => {

  if (isEmpty(api)) {
    return new Promise((resolve) => {
      resolve();
    });
  }
  let hide;
  if (true === data.needLoading) {
    hide = message.loading(myFormatMessage('global.request.loading'), 0);
  }

  const fData = {
    ...omit(data, ['signal', 'needLoading']),
    locale: 'en-US' !== window.localStorage.getItem('umi_locale') ? 'zh' : 'en', // 加上国际化参数

  };

  // if (options && options.params) {
  //   // 加上国际化参数
  //   options.params.locale = 'en-US' !== window.localStorage.getItem('umi_locale') ? 'zh' : 'en';
  // }

  return request(api, {
    method: 'post',
    timeout: reqTimeOut,
    headers: {
      'Content-type': 'application/json;charset=UTF-8',
      // 'Content-type':'application/x-www-form-urlencoded',
      Accept: 'application/json;charset=UTF-8',
    },
    body: urlEncode(fData),
    // data: { ...omit(data, ['signal', 'needLoading']) },
    ...assign({ signal: data.signal }, options),
  }).then((res) => {
    if (isObject(res) && res.data && 'undefined' !== typeof res.data.status && data.signal) {
      data.signal.noAbort = true;
    }
    isFunction(hide) && hide();
    // 如果没有登陆，则跳转到登录页
    isLogin(res);
    return res ? res.data : null;
  });
};

/**
 * new 异步请求控制器
 */
export const newAbortCtrl = () => {
  if ('AbortController' in window) {
    return new window.AbortController();
  } else {
    console.warn('浏览器不支持 AbortController，将无法中止异步请求');
    return {};
  }
};

export const abortFetch = (abortCtrl) => {
  if ('AbortController' in window) {
    if (abortCtrl && true !== abortCtrl.signal.noAbort) {
      abortCtrl.abort();
    }
  } else {
    console.warn('浏览器不支持 AbortController，将无法中止异步请求');
    return {};
  }
};

// console.log('process.env.NODE_ENV', process.env.NODE_ENV);
// console.log('process.env.apiPrefix', process.env.apiPrefix);

export default request;
