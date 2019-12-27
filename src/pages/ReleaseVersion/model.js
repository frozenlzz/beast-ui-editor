import services from './service';
import { modelName } from './config';
import createCRUDModel from '@/helpers/createCRUDModel';
// 第三个参数为预留自定义操作
export default createCRUDModel(modelName, services, {

});
