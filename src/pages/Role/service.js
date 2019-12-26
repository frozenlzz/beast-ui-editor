import createCRUDService from '@/helpers/createCRUDService';
import { api } from './config';
import { reqGet } from '@/helpers/request';

/**
 * 获取所有权限模块
 * @param params
 * @param options
 * @returns {Promise<any>}
 */
export async function fetchSecList(params, options = {}) {
  return reqGet(api.secQuery, params, options);
}

export default createCRUDService(api);
