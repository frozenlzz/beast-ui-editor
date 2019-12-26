export default [
  {
    icon: 'home',
    name: '首页',
    key: '/dashboard',
    path: '/dashboard',
  },
  {
    icon: 'home',
    name: 'pc设计',
    key: '/interfaceDesign',
    path: '/interfaceDesign',
  },
  {
    icon:'setting',
    name:'设置',
    key:'/setting',
      children:[
        {
          name: '角色',
          en: 'Role',
          key: '/role',
          path: '/role',
          parent: ['/setting'],
        },
      ]
  },
];
