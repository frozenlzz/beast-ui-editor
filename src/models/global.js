import { isArray, isEmpty, omit, orderBy } from 'lodash-es';
import { getRandomKey, getStorage } from '@/utils/utils';

let locale = getStorage('umi_locale') || '';

export default {
  namespace: 'global',
  state: {
    appCode: '', // 当前的应用编码（appCode）
    loginTimeout: false, // 标识是否登录会话过期了
    randomKey: '', // 随机数，用于强制重新渲染整个应用
    locale: locale, // 当前语言类型
  },

  effects: {
  },
  reducers: {
    setStateByPayload(state, { payload }) {
      return { ...state, ...payload };
    }
  },
};
