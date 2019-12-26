import services from './service';
import { modelName } from './config';
import createCRUDModel from '@/helpers/createCRUDModel';

export default createCRUDModel(modelName, services);
