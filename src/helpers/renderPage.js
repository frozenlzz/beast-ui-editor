import React from 'react';
import { cloneDeep, isArray, isEmpty } from 'lodash-es';
import * as JH_DOM from 'jh-lib';
import * as Loader from './loader';

/**
 * 输出对应的DomType功能模块
 * @param {Object} {}
 * @param {boolean} pointerEvents 是否禁用当前元素的所有操作
 * */
export const BOM_TYPE = ({ DomType = '', name = 'demo1', style = {}, attribute = {} }, pointerEvents = true) => {
  let newStyles = cloneDeep(style);
  let newAttribute = cloneDeep(attribute);
  let bom = null;
  if (!isEmpty(newAttribute)) {
    for (let key in newAttribute) {
      if (newAttribute.hasOwnProperty(key) && newAttribute[key].hasOwnProperty('$$_type')) {
        newAttribute[key] = Loader[newAttribute[key]['$$_type']].translate(newAttribute[key]);
      }
    }
  }
  newStyles.width = '100%';
  pointerEvents && (newStyles['pointerEvents'] = 'none');
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
export const DataToDom = (data, pointerEvents = true) => {
  if (!isEmpty(data) && isArray(data)) {
    let newData = cloneDeep(data);
    return newData.map((item, index) => {
      const { DomType = '', name = 'demo1', style = {}, attribute = {} } = item;
      item.comp = BOM_TYPE({ DomType, name, style, attribute }, pointerEvents);
      return item;
    });
  }
};

// 将属性实体转换为对应jsx
// export function attributesToDOM (type, body) {
//   if(type === 'jsx') {
//     if(!isEmpty(body)){
//       return body.map((item, index) => {
//         if(item['$$_type'] === 'component' && !isEmpty(item['$$_body'])){
//           const newBody = cloneDeep(item['$$_body']);
//           if(JH_DOM[newBody['DomType']]){
//             const Data = JH_DOM[newBody['DomType']];
//             const newAttribute = newBody['attribute'] || {};
//             const newStyle = newBody['style'] || {};
//             return <Data {...newAttribute} style={{ ...newStyle }} key={index}></Data>;
//           }
//         }
//       })
//     }
//   }
// }
