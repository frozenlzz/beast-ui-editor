import { isArray, isEmpty, isObject, map } from 'lodash-es';

/**
 * 递归为对象数组里的对象，添加 key 字段以及其他额外字段
 * @param data Array<Object>
 * @param keyAccordName String 默认是'id'；为对象添加的'key'字段，是参照对象里哪个原有的字段 作为值的
 * @param addFields Array<Array(2)> 需要添加的字段信息，是个二维数组，例如：[['name', 'title'], ['code', 'keyCode']]，表示添加的'title'字段值为’name'字段的值，以此类推
 * @returns {Array}
 */
export const recurAddKeyAndFileds = (data, keyAccordName = 'id', addFields = []) => {
  return recursiveMap(data, (obj, k, pObj) => {
    const reObj = { ...obj };

    if (pObj && pObj[keyAccordName]) {
      reObj.key = `${pObj.key || pObj[keyAccordName]}-${obj[keyAccordName]}`;
    } else {
      reObj.key = `${obj[keyAccordName]}`;
    }

    addFields && addFields.forEach(fields => {

      if (fields && fields[0] && fields[1] && pObj && pObj[fields[0]]) {
        reObj[fields[1]] = pObj[fields[0]];
      }
    });
    return reObj;
  });
};

export const recurRemoveFields = (data, rmFields = ['key']) => {
  return recursiveMap(data, (obj) => {
    const reObj = { ...obj };
    rmFields && rmFields.forEach(fName => {
      delete reObj[fName];
    });
    return reObj;
  });
};

export const recursiveMap = (data, func, parentObj = {}, childKeyName = 'children') => {

  if (isArray(data) && data.length > 0) {

    return data.map((obj, key) => {
      const tmpObj = func(obj, key, parentObj);

      if (isObject(obj)) {

        if (!isEmpty(obj[childKeyName])) {
          tmpObj[childKeyName] = recursiveMap(obj[childKeyName], func, tmpObj, childKeyName);
        }
      }
      return tmpObj;
    });

  } else {
    return [];
  }
};

export const recursiveFind = (data, func, childKeyName = 'children') => {

  if (isArray(data) && data.length > 0) {
    let reObj = null;

    for (let key = 0, len = data.length; key < len; key++) {
      const obj = data[key];
      const isOk = func(obj, key);
      // console.log('isOk',isOk);
      if (!isOk && isObject(obj)) {

        if (!isEmpty(obj[childKeyName])) {
          reObj = recursiveFind(obj[childKeyName], func, childKeyName);

          if (!isEmpty(reObj)) break;
        }

      } else {
        reObj = obj;
        break;
      }
    }
    return reObj;

  } else {
    return null;
  }
};

export const addListNumber = (data, page) => {
  if (page) {
    const preNo = (page.current - 1) * page.size;
    map(data, (val, key) => {
      const obj = {
        key: key,
        no: key + 1 + (isNaN(preNo) ? 0 : preNo),
        ...val,
      };
      data[key] = obj;
    });
  }
  return data;
};
