// import { routerRedux } from 'dva/router';
// import { userLogin } from '@/services/login';

export default {
    namespace: 'login',
    state: {
        status: undefined,
        corpInfo:{},
        step:{},
        currencyList:[],//单位本币
        planList:[] //解决方案
    },

    effects: {
        *login({ payload }, { call, put }) {
            // const response = yield call(userLogin, payload);
        },
    },

    reducers: {
        saveStepFormData(state,{payload}){
            return {
                ...state,
                step:{...payload}
            };
        },
      corpInfoData(state,{payload}){
        return {
          ...state,
          ...payload,
        };
      },
    },
};
