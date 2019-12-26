import { message, Modal } from 'antd';
import keyCodes from '/common/keyCodes';

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error('onError', err);
    },
    initialState: {
      // products:[
      //   { name: 'dva',download:10, id: 1,key:1 },
      //   { name: 'antd',download:20, id: 2,key:2 }
      // ]
    },
  },
};

// export function onRouteChange({ location, routes, action }) {
//   console.log('onRouteChange:', location, routes, action)
// }

message.config({
  top: 100,
  // duration: 2,
  maxCount: 1,
});

document.body.onclick = (e) => {
  if (e.target && /(INPUT|TEXTAREA)/.test(e.target.tagName) && e.target.select) {
    e.target.select();
  }
};

let refleshConfirm = null;
document.body.onkeydown = function(e) {
  let keyCode = e.keyCode || e.which || e.charCode;

  // 禁止浏览器默认的 backspace 历史返回操作;
  if (keyCodes.backspace === keyCode && e.target && !(/(INPUT|TEXTAREA)/.test(e.target.tagName))) {
    e.preventDefault();
  }
  // 在输入框时，禁止浏览器的 F5 刷新
  if (keyCodes.f5 === keyCode) {
    e.preventDefault();
    if (null === refleshConfirm &&
      e.target && !(/(INPUT|TEXTAREA)/.test(e.target.tagName))
      && /(Add|detail|acctSettle)/.test(window.location.href)) {
      refleshConfirm = Modal.confirm({
        title: '确认刷新网站吗?',
        content: '刷新网站后，当前页面的缓存数据将被清空',
        centered: true,
        onOk() {
          refleshConfirm = null;
          window.location.reload();
        },
        onCancel() {
          refleshConfirm = null;
        },
      });
    }
  }
};
// {
//  history,
//  initialState,
//  onError,
//  onAction,
//  onStateChange,
//  onReducer,
//  onEffect,
//  onHmr,
//  extraReducers,
//  extraEnhancers,
//}
