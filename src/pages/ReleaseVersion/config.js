import { appConfig } from '@/appConfig';

const config = appConfig.RELEASE_VERSION;

export const appCode = config.appCode;
export const modelName = config.modelName;
export const api = config.api;
export const cn = config.cn;

export const breadcrumbList = [
  {
    title: '测评报告管理',
  },
  {
    title: '报告列表',
  },
];

export default config;

