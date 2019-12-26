import createCRUDService from '/common/helpers/createCRUDService';
import { api } from './config';
export default createCRUDService(api);

// import { jsonPost, reqGet } from '/common/helpers/request';

// // 查询大类信息
// export async function findSkinClass(params, options = {}) {
//   return reqGet(api.findSkinClass, params, options);
// }
// // 提交信息
// export async function saveUserInfo(params, options = {}) {
//   return reqGet(api.saveUserInfo, params, options);
// }
// // 查询套餐信息
// export async function findSkinClassByScheme(params, options = {}) {
//   return reqGet(api.findSkinClassByScheme, params, options);
// }
