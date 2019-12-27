import { message, Modal } from 'antd';
import keyCodes from '@/keyCodes';
import { setLocale } from 'umi-plugin-locale';
import { myFormatMessage } from '@/utils/localeUtils';
import { stringify } from 'qs';

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

message.config({
  top: 100,
  duration: 2,
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
        title: myFormatMessage('global.reload.title'),
        content: myFormatMessage('global.reload.tip'),
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

window.setLocale = setLocale;

window.openWin = function() {
  let newWin = window.open(...arguments);

  if (!newWin || newWin.closed || typeof newWin.closed == 'undefined') {
    // '本站弹出窗口被屏蔽，如需查看请修改浏览器相关配置!'
    message.error(myFormatMessage('tip.window.open'));
  }
  return newWin;
};

// (function(window, $, locale) {
//   var reObj = {
//     force: false,
//     errors: [],
//     setErrors: function(msgObj, paramObj) {
//       this.errors.push(window.formatCheckErr(msgObj[locale], paramObj));
//     },
//     setForce: function(force) {
//       this.force = force;
//     },
//   };
//
//   ////////////////////// 校验逻辑 - start ///////////////////////////////
//
//   //== “单元格取值”示例
//
//   // 示例1：强控，单元格(第9行,第5列)不等于单元格(第9行，第6列)
//   if ($.cellValue(9, 5) != $.cellValue(9, 6)) {
//     reObj.setErrors({ cn: '[强控]【合计-本期期末】不等于【NC抽取-本期期末】', en: '英文提示' }, {});
//     reObj.setForce(true); // 设置为强控
//   }
//
//   // 示例2：弱控，单元格(第9行,第4列)不等于单元格(第9行，第3列)
//   if ($.cellValue(9, 4) != $.cellValue(9, 3)) {
//     reObj.setErrors({ cn: '【其他-本期期末】不等于【机器设备-本期期末】', en: '英文提示' }, {});
//   }
//
//   //== “单元格取值”示例
//
//
//   ////////////////////// 校验逻辑 - end ///////////////////////////////
//
//   return {
//     errors: reObj.errors,
//     force: reObj.force,
//   };
// })(window, window.TH, 'en-US' !== window.localStorage.getItem('umi_locale') ? 'cn' : 'en');

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
