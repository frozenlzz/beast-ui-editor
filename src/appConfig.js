export * from '/common/appConfig';

import * as commonConfig from '/common/appConfig';

// console.log('commonConfig', commonConfig);
// console.log('commonConfig', commonConfig.getAppCodes);

const commActTypes = commonConfig.commActTypes;

export const appConfig = {
  // ...commonConfig.appConfig,
  INTERFACE_DESIGN: {
    cn: 'PC界面设计',
    modelName: 'interfaceDesign',
    appCode: 'INTERFACE_DESIGN',
    finderCode: 'FINDER_INTERFACE_DESIGN',
    authConfig: {
      moduleCode: 'api_base',
      functionCode: 'interfaceDesign',
      // actionTypes: {
      //   ...commActTypes,
      // },
    },
    // detailRoute: '/host/detail',
    api: {
      objectList: "http://localhost:3000/object/list"
    },
  },
  RELEASE_VERSION: {
    cn: '生产版',
    modelName: 'releaseVersion',
    appCode: 'RELEASE_VERSION',
    finderCode: 'FINDER_RELEASE_VERSION',
    authConfig: {
      moduleCode: 'api_base',
      functionCode: 'releaseVersion',
      // actionTypes: {
      //   ...commActTypes,
      // },
    },
    // detailRoute: '/host/detail',
    api: {
    },
  },
  ROLE: {
    cn: '角色',
    modelName: 'role',
    appCode: 'API_WEB_ROLE',
    finderCode: 'FINDER_WEBROLE',//
    finderConfig: {
      actionType: 'global/findObjectList',
      reqApi: '/api/base/role/pub/query', // 异步请求的 api
    },
    authConfig: {
      moduleCode: 'api_base',
      functionCode: 'role',
      actionTypes: {
        ...commActTypes,
      },
    },
    // detailRoute: '/role/detail',
    api: {
      listApi: '/api/base/role/pub/query',
      detailApi: '/api/base/role/find',
      saveApi: '/api/base/role/save',
      delApi: '/api/base/role/delete',

      // 权限
      secQuery: '/api/auth/src_sec/pub/query',
    },
  },

};

export const appCodes = commonConfig.getAppCodes(appConfig);


