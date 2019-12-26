import { appConfig } from '@/appConfig';
import React from 'react';
import { isEmpty, cloneDeep, isArray } from 'lodash';
import JH_DOM from '@/static/config';
const config = appConfig.INTERFACE_DESIGN;

export const appCode = config.appCode;
export const modelName = config.modelName;
export const api = config.api;
export const cn = config.cn;

// export const breadcrumbList = [
//   {
//     title: '测评报告管理',
//   },
//   {
//     title: '报告列表',
//   },
// ];

export default config;

// 输出对应的DomType功能模块
export const BOM_TYPE = ({ DomType = '', name = 'demo1', style = {}, attribute = {} }) => {
  let newStyles = cloneDeep(style);
  let bom = null;
  newStyles.width = '100%';
  if (JH_DOM[DomType]) {
    let Data = JH_DOM[DomType];
    bom = <Data { ...attribute } style={{ ...newStyles }} name={name} />;
  } else {
    bom = (
      <DomType {...attribute} style={{ ...newStyles }} >{ name }</DomType>
    );
  }
  // switch (DomType) {
  //   case 'button':
  //     bom = (
  //       <Button {...attribute} style={{ ...newStyles }}>
  //         {name}
  //       </Button>
  //     );
  //     // console.log(types.index[DomType])
  //     // console.log(types.button)
  //     break;
  //   case 'input':
  //     bom = <Input {...attribute} style={{ ...newStyles }} />;
  //     break;
  //   case 'h2':
  //     bom = (
  //       <h2 {...attribute} style={{ ...newStyles }}>
  //         {name}
  //       </h2>
  //     );
  //     break;
  //   case 'div':
  //     bom = (
  //       <div {...attribute} style={style}>
  //         {name}
  //       </div>
  //     );
  //     break;
  //   default:
  //     let Data = styles[DomType];
  //     bom = <Data attribute={{ ...attribute }} newStyles={{ ...newStyles }} name={name}></Data>;
  //     console.log(styles[DomType]);
  // }
  return bom;
};
// 将数据转换成可渲染页面数据格式
export const DataToDom = data => {
  if (!isEmpty(data) && isArray(data)) {
    let newData = cloneDeep(data);
    return newData.map((item, index) => {
      const { DomType = '', name = 'demo1', style = {}, attribute = {} } = item;
      item.comp = BOM_TYPE({ DomType, name, style, attribute });
      return item;
    });
  }
};

/**
 * 生成随机字符串(可指定长度)
 * @param len
 * @returns {string}
 */
export const randomString = len => {
  len = len || 16;
  var $chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
  var maxPos = $chars.length;
  var pwd = '';
  for (var i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};

/**
 *
 * @param {Array} data 总页面配置表
 * @param {String} index 当前需要输出的对象对应的 key 值
 * @returns {Object} 输出key值对应的对象
 * */

function getElementToKey() {
  let newData;
  return function fn({ data = [], index = '' }) {
    if (data.length !== 0) {
      data.map((v, i) => {
        if (v.key === index) {
          newData = v;
          return v;
        } else if (v.children && v.children.length > 0) {
          fn({ data: v.children, index: index });
        } else {
          return {};
        }
      });
    }
    return newData;
  };
}
export const getKeyToElement = getElementToKey();

// 对应添加对象
export function addChildrenData(initData, key, data) {
  if (key === -1) {
    initData.push(data);
  } else {
    initData.forEach(v => {
      if (v.key === key && v.children) {
        v.children.push(data);
        return;
      } else if (v.children) {
        addChildrenData(v.children, key, data);
      }
    });
  }
}

// 删除对应对象
export function deleChildrenData(initData, key) {
  initData.forEach((v, i) => {
    if (v.key === key) {
      initData.splice(i, 1);
      return;
    } else if (v.children) {
      deleChildrenData(v.children, key);
    }
  });
}

// 修改对应对象
export function editChildrenData(initData, key, data) {
  initData.forEach((v, i) => {
    if (v.key === key) {
      for (let j in v) {
        if (j !== 'key') {
          v[j] = typeof data[j] !== 'undefined' ? (data[j] !== '' ? data[j] : '') : v[j];
        }
      }
      return;
    } else if (v.children) {
      editChildrenData(v.children, key, data);
    }
  });
}
