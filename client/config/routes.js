export default [
  {
    path: '/user',
    layout: false,
    name: '用户',
    hideInMenu: true,
    routes: [
      {
        name: '登录',
        path: '/user/login',
        component: './User/Login',
      },
      {
        name: '注册',
        path: '/user/register',
        component: './User/Register',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    name: '个人收藏夹',
    icon: 'home',
    hideInMenu: true,
    access: '1001',
    component: './Nav',
  },
  {
    path: '/setting',
    name: '配置中心',
    hideInMenu: false,
    icon: 'crown',
    access: '1099',
    routes: [
      { path: '/setting', redirect: '/setting/search' },
      {
        path: '/setting/search',
        name: '搜索配置',
        icon: 'smile',
        component: './Setting/Search',
      },
    ],
  },
  {
    component: './404',
  },
];
