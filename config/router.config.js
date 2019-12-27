//component './'为pages目录下

const routes = [
  {
    path: '/', component: '../layouts/BlankLayout',
    routes: [
      { path: '/', redirect: '/interfaceDesign' },
      { path: '/interfaceDesign', component: './InterfaceDesign', title: 'pc设计' },
      { path: '/interfaceDesign/detail/:id?', component: './InterfaceDesign/Detail', title: 'pc设计' },
      { path: '/releaseVersion', component: './ReleaseVersion', title: '发布版本' },
    ],
  },
];
module.exports = routes;
