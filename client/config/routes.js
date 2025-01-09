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
    path: '/',
    name: '我的收藏夹',
    icon: 'home',
    hideInMenu: true,
    access: '1001',
    component: '@/components/Layout/NavLayout',
    routes: [
      {
        name: '我的收藏夹',
        path: '/',
        icon: 'dotChart',
        access: '1001',
        component: './Nav',
      },
      {
        name: '我的收藏夹',
        path: '/nav/:sortId/',
        icon: 'dotChart',
        access: '1001',
        component: './Nav/ChildNav',
      },
    ],
  },
    component: './404',
  },
];
