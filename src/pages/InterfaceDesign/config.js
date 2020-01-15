import { appConfig } from '@/appConfig';
import React from 'react';
import { isEmpty, cloneDeep, isArray, forEach } from 'lodash-es';
import * as JH_DOM from 'jh-lib';
import { JhTabs } from '@/static/config';

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
  let newAttribute = cloneDeep(attribute);
  let bom = null;
  if (!isEmpty(newAttribute)) {
    for (let key in newAttribute) {
      if (newAttribute.hasOwnProperty(key) && newAttribute[key]['$$_type'])
        newAttribute[key]['$$_type'] === 'jsx' && (newAttribute[key] = attributesToDOM(newAttribute[key]['$$_type'], newAttribute[key]['$$_body']));
    }
  }
  newStyles.width = '100%';
  if (JH_DOM[DomType]) {
    let Data = JH_DOM[DomType];
    bom = <Data {...newAttribute} style={{ ...newStyles }}></Data>;
  } else {
    bom = (
      <div>{name}</div>
    );
  }
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
  let $chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
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
export function deleteChildrenData(initData, key) {
  initData.forEach((v, i) => {
    if (v.key === key) {
      initData.splice(i, 1);
      return;
    } else if (v.children) {
      deleteChildrenData(v.children, key);
    }
  });
}

// 修改对应对象
export function editChildrenData(initData, key, data) {
  initData.forEach((v, i) => {
    if (v.key === key) {
      for (let j in v) {
        if (j !== 'key' && v.hasOwnProperty(j)) {
          v[j] = typeof data[j] !== 'undefined' ? (data[j] !== '' ? data[j] : '') : v[j];
        }
      }
      return;
    } else if (v.children) {
      editChildrenData(v.children, key, data);
    }
  });
}

// 将属性实体转换为对应jsx
export function attributesToDOM (type, body) {
  if(type === 'jsx') {
    if(!isEmpty(body)){
       return body.map((item, index) => {
         if(item['$$_type'] === 'component' && !isEmpty(item['$$_body'])){
           const newBody = cloneDeep(item['$$_body']);
           if(JH_DOM[newBody['DomType']]){
             const Data = JH_DOM[newBody['DomType']];
             const newAttribute = newBody['attribute'] || {};
             const newStyle = newBody['style'] || {};
             return <Data {...newAttribute} style={{ ...newStyle }} key={index}></Data>;
           }
         }
      })
    }
  }
}
