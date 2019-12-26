import services from './service';
import { modelName } from './config';
import createCRUDModel from '/common/helpers/createCRUDModel';
// 第三个参数为预留自定义操作
export default createCRUDModel(modelName, services, {

});
