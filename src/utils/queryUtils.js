import { isEmpty, isArray, isObject, forEach } from 'lodash-es';

export const formatFilter = (searchData = {}) => {
  const filter = {
    'logic': 'AND',
    'children': [],
  };
  const { fuzzyMatch, search, filterData } = searchData;

  // 模糊搜索
  if (!isEmpty(fuzzyMatch) && !isEmpty(search)) {
    const fuzzyArr = fuzzyMatch.split(',').filter(v => (v && 0 != v));
    if (!isEmpty(fuzzyArr)) {
      const tmpO = {
        logic: 'OR',
        children: fuzzyArr.map(v => ({
          logic: 'OR',
          'filterField': v,
          'expression': 'LIKE',
          'value': search,
        })),
      };
      filter.children.push(tmpO);
    }
  }

  // 更多搜索字段
  // const filterDataTest = {
  //   'bizDate': ['2019-03', '2019-05'],
  //   'createInfo.userId': 3,
  //   'AnalysisDetails.id': { expression: 'IN', value: '1,3,5,7,9' },
  //   'AnalysisDetails.creditAmount,AnalysisDetails.debitAmount': [100, 200],
  //   'name': { expression: 'LIKE', value: 'ananna' },
  // };
  if (!isEmpty(filterData)) {
    forEach(filterData, (v, k) => {
      if (0 === v || !isEmpty(v)) {
        const kArr = k.split(',').filter(v => (v && 0 != v));

        if (!isEmpty(kArr)) {
          if (kArr.length > 1) {
            filter.children.push({
              logic: 'OR',
              children: kArr.map(kStr => (
                deal2FilterItem(kStr, v, 'OR')
              )),
            });
          } else {
            filter.children.push(deal2FilterItem(kArr[0], v, 'AND'));
          }
        }
      }
    });
  }
  return filter;
};

const deal2FilterItem = (kStr, v, logic) => {
  let tmpO;

  if (isArray(v)) {
    tmpO = {
      logic,
      'filterField': kStr,
      'expression': 'BETWEEN',
      'value': getValueNoNull(v[0]),
      'maxValue': getValueNoNull(v[1]),
    };

  } else if (isObject(v)) {
    if (isArray(v.value)) {
      tmpO = {
        logic,
        'filterField': kStr,
        'expression': 'BETWEEN',
        'value': getValueNoNull(v.value[0]),
        'maxValue': getValueNoNull(v.value[1]),
      };
    } else {
      let value = getValueNoNull(v.value);

      if ('IN' === v.expression) {
        value = `(${value})`;
      }

      tmpO = {
        logic,
        'filterField': kStr,
        'expression': v.expression || '=',
        'value': value,
      };
    }

  } else {
    tmpO = {
      logic,
      'filterField': kStr,
      'expression': '=',
      'value': getValueNoNull(v),
    };
  }
  return tmpO;
};

export const getValueNoNull = (value) => {
  return null === value || 'undefined' === typeof value ? '' : value;
};
