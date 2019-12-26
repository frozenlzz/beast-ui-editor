export default {
  /**
   * 登录(get)
   */

  login: '/',

  /**
   * 账号密码登录（post)
   */
  pswLogin:'/login',

  /**
   * 退出登录
   */
  logout: '/logout',

  // 根据 code（微信扫码后获得的 code）获取 openid
  getWxIDByCode: '/api/wechatAuth/open/getOpenid',//'/api-detect/wechatAuth/open/getOpenid'
  setSessionByOpenid: '/api/wechatAuth/open/setSession',//'/api-detect/wechatAuth/open/setSession'
  getWecahtConf:'/api/wechatAuth/open/getWecahtConf',// '/api-detect/wechatAuth/open/getWecahtConf',

  /**
   * 获取用户信息
   */
  userInfo: '/api/auth/userInfo/findUserInfo',
  /**
   * 修改用户名
   */
  updateName: '/api-detect/auth/userInfo/updateName',

  /**
   * 控件初始化(get)
   */
  selectorFindByCode: '/api-detect/component/selector/findByCode',

  /**
   * 获取手机验证码
   */
  sendCaptcha: '/api/auth/webAuthoriztion/open/sendCaptcha',

  /**
   * 注册公司
   */
  registerCorp: '/api-detect/auth/webAuthoriztion/open/registerCorp',

  /**
   * 查找用户的公司
   */
  findUserCorp: '/api-detect/auth/webAuthoriztion/open/findCorpByIdent',

  /**
   * 查找枚举 ,并加载选项内容
   */
  findByCode: '/api/component/selector/open/findByCode',

  /**
   * 查找对象列表数据 ,并加载选项内容
   */
  findByAppCode: '/api/component/finder/open/findByAppCode',

  /**
   * 查找对象列表数据 ,并加载选项内容
   */
  // findByFinderCode: '/api-detect/component/finder/open/findByFinderCode',

  /**
   * 根据 code 获取对象数据
   */
  findByDataCode: '/api-detect/component/dataBasic/findByDataCode',

  /**
   * 获取地址信息
   */
  findAddress: '/api-detect/component/address/open/findPartByParent',  //type:{1:国家,2:省,3:市,4:区/镇,5:乡}

  /**
   * 获取行业信息
   */
  findIndustry: '/api-detect/auth/webAuthoriztion/open/findIndustry',

  /**
   * 获取解决方案
   */
  findSolution: '/api-detect/auth/webAuthoriztion/open/findSolution',
  /**
   * 获取单位币种
   */
  findCurrency: '/api-detect/auth/webAuthoriztion/open/findCurrency',


  /**
   * 重置密码
   */
  resetPassword: '/api/admin/empInfo/resetPassword',
  /**
   * 修改密码
   */
  updatePassword:'/api/auth/userInfo/updatePassword',//'/api-detect/auth/webAuthoriztion/updatePassword',
  /**
   *查找公司信息
   */
  findCorpInfo:'/api/auth/webAuthoriztion/open/findCorpInfo',
  /**
   * 文件管理
   */
  // docListApi: '/api-detect/auth/document/pub/query',
  createDocApi: '/api-detect/auth/document/createDir',
  deleteDocApi: '/api-detect/auth/document/deleteFile',
  batchDelDocApi: '/api-detect/auth/document/batchDeleteFile',
  // uploadDocApi: '/api-detect/auth/document/upload',
  uploadDocApi: '/api-skin/upload',
  renameDocApi: '/api-detect/auth/document/rename',

  /**
   * 上传文件
   */
  uploadFileApi: '/api/component/file/upload',

  /**
   * 导入导出
   */
  exportAPi: '/dataExchange/exportData',
  exResultAPi: '/dataExchange/result',
  importExcelAPi: '/dataExchange/importExcel',
  exportTemplateApi: '/dataExchange/exportTemplate',
  isCreateConfApi: '/dataExchange/isCreateConf',
};
