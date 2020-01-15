import { appConfig } from '@/appConfig';
import React from 'react';
import { isEmpty, cloneDeep, isArray, forEach } from 'lodash-es';

const config = appConfig.INTERFACE_DESIGN;

export const appCode = config.appCode;
export const modelName = config.modelName;
export const api = config.api;
export const cn = config.cn;

export default config;

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

