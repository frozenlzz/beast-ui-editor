export * from '/common/globalConfig';
import * as commonConfig from '/common/globalConfig';
// 应用配置，在这里导出，是为了兼容旧代码
import { appConfig as appCnf } from '@/appConfig';

// 应用
export const appConfig = appCnf;
// export {appConfig} from '@/appConfig';

// 此变量值之后只用于配置“枚举”类型的常量，”查找器“类型常量已转移”@/appConfig“
export const comboTypes = {
  ...commonConfig.comboTypes,
};
