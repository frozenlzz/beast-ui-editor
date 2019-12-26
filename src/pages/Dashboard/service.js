import { jsonPost, reqGet } from '@/helpers/request';

/**
 * 添加查询科目
 * @param data
 * @param options
 * @returns {Promise<any>}
 */
export const addQueryItem = (data, options) => {
  return jsonPost('/api/fi/financialIndex/addQueryItem', data, options);
};

/**
 * 获取查询科目
 * @param data
 * @param options
 * @returns {Promise<any>}
 */
export const getQueryItem = (data, options) => {
  return reqGet('/api/fi/financialIndex/getQueryItem', data, options);
};


/**
 * 查询财务指标
 * @param data
 * @param options
 * @returns {Promise<any>}
 */
export const fetchFinancialList = (data, options) => {
  return reqGet('/api/fi/financialIndex/list', data, options);
};

/**
 * 删除查询科目
 * @param data
 * @param options
 * @returns {Promise<any>}
 */
export const removeQueryItem = (data, options) => {
  return reqGet('/api/fi/financialIndex/removeQueryItem', data, options);
};
