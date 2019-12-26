import { jsonPost, reqGet } from '@/helpers/request';
export * from '/common/services/global';
/**
 * 带分页的查找器接口
 * @param params
 * @param options
 */
export function pageFindByFinderCode(params, options = {}) {
  //console.log('params:',params);
  return reqGet('/api/component/finder/pageFindByFinderCode', params, options);
}