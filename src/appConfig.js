export const appConfig = {
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
      objectList: 'http://localhost:3000/object/list',
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
    api: {},
  },
};

const appCodeObj = {};

for (let k in appConfig) {

  if (appConfig.hasOwnProperty(k)) {
    let v = appConfig[k];
    appCodeObj[k] = v.appCode;
  }
}

export const appCodes = appCodeObj;


