import { appConfig } from '@/appConfig';

const config = appConfig.ROLE;

export const appCode = config.appCode;
export const modelName = config.modelName;
export const api = config.api;
export const cn = config.cn;

export const breadcrumbList = [
  {
    title: '设置',
  },
  {
    title: '权限设置',
  },
];

export default config;
