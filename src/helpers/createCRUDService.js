import { failHandler, jsonPost, reqGet } from '@/helpers/request';

export default (api) => {
  /**
   * 获取列表
   * @param params
   * @param options
   * @returns {*}
   */
  async function fetchList(params, options = {}) {
    return reqGet(api.listApi, params, options).then(failHandler);
  }

  /**
   * 获取详情
   * @param params
   * @param options
   * @returns {*}
   */
  async function fetchDetail(params, options = {}) {
    return reqGet(api.detailApi, params, options);
  }

  /**
   * 保存
   * @param params
   * @param options
   * @returns {*}
   */
  async function saveDetail(params, options = {}) {
    return jsonPost(api.saveApi, params, options);
  }


  /**
   * 删除
   * @param params
   * @param options
   * @returns {*}
   */
  async function deleteDetail(params, options = {}) {
    return reqGet(api.delApi, params, options);
  }

  /**
   * 删除
   * @param params
   * @param options
   * @returns {*}
   */
  async function multiDel(params, options = {}) {
    return reqGet(api.multiDelApi, params, options);
  }

  return {
    fetchList,
    fetchDetail,
    saveDetail,
    deleteDetail,
    multiDel,
  };
}


