//component './'为pages目录下

const routes = [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login', title: '登录' },
      {
        path: '/user/register', component: './User/Register', routes: [
          {
            path: '/user/register',
            redirect: '/user/register/regScheme',
            title: '注册',
          },
          {
            path: '/user/register/regScheme',
            component: './User/StepRegForm/Step1',
            title: '注册-选择方案',
          }, {
            path: '/user/register/regInfo',
            component: './User/StepRegForm/Step2',
            title: '注册-完善信息',
          }, {
            path: '/user/register/regResult',
            component: './User/StepRegForm/Step3',
            title: '注册完成',
          },
        ],
      },
      { path: '/user/findPassword', component: './User/FindPassword', title: '忘记密码' },
      { path: '/user/authorLogin', component: './User/AuthorLogin', title: '登录' },
      { path: '/user/wxAuthor', component: './User/WxAuthorLogin', title: '微信登录' },
    ],
  },
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/login', component: './User/Login', title: '登录' },
    ],
  },
  {
    path: '/transformCode', component: './AuthorBind/TransformCode', title: '绑定微信',
  },

  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/', redirect: '/interfaceDesign' },
      { path: '/404', component: './Page404', title: '找不到网页' },
      { path: '/403', component: './Page403', title: '权限受限' },
      { path: '/dashboard', component: './Dashboard/index', title: '首页' },
      {
        path: '/interfaceDesign', component: './InterfaceDesign',
        routes: [
          { path: '/interfaceDesign', component: './index', title: 'pc设计' },
          { path: '/interfaceDesign/detail/:id?', component: './InterfaceDesign/Detail', title: 'pc设计' },
        ],
      },
      {
        path: '/releaseVersion', component: './ReleaseVersion', title: '发布版本',
      },

      {
        path: '/userSetting', component: './UserSetting', title: '个人设置',
        // routes: [
        //   { path: '/userSetting/', component: './index', title: '个人设置' },
        // ],
      },
      {
        path: '/role', component: './Role',
        routes: [
          { path: '/role/', component: './index', title: '角色' },
          { path: '/role/detail/:id?', component: './Role/Detail', title: '角色' },
        ],
      },
    ],
  },

];
module.exports = routes;
