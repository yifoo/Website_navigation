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
    name: '设置中心',
    icon: 'crown',
    hideInMenu: true,
    access: '1006',
    routes: [
      { path: '/setting', access: '10061', redirect: '/setting/account/edituname' },
      {
        path: '/setting/account',
        name: '账户中心',
        icon: 'user',
        access: '10061',
        hideInMenu: false,
        routes: [
          {
            name: '账户修改',
            path: '/setting/account/edituname',
            icon: 'user',
            component: './Setting/Account/Config/EditUserName',
          },
          {
            name: '修改密码',
            path: '/setting/account/editupwd',
            icon: 'dotChart',
            component: './Setting/Account/Config/EditUpwd',
          },
        ],
      },
      {
        path: '/setting/user',
        name: '用户角色',
        icon: 'user',
        access: '10062',
        hideInMenu: false,
        routes: [
          {
            name: '用户管理',
            path: '/setting/user/list',
            icon: 'dotChart',
            component: './Setting/Account/UserList',
          },
          {
            name: '角色权限',
            path: '/setting/user/role',
            icon: 'dotChart',
            component: './Setting/Account/UserRole',
          },
        ],
      },
      {
        path: '/setting/search',
        name: '搜索配置',
        icon: 'search',
        access: '10063',
        hideInMenu: false,
        routes: [
          {
            name: '搜索配置',
            path: '/setting/search/config',
            icon: 'dotChart',
            component: './Setting/Search/Config',
          },
          {
            path: '/setting/search/list',
            name: '搜索历史',
            icon: 'smile',
            component: './Setting/Search/RecordList',
          },
        ],
      },
    ],
  },
  {
    path: '/',
    name: '我的收藏夹',
    icon: 'home',
    hideInMenu: true,
    access: '1001',
    component: '@/pages/Nav/components/Layout',
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
        path: '/nav/:sort/',
        icon: 'dotChart',
        access: '1001',
        component: './Nav/ChildNav',
      },
    ],
  },
  {
    component: './404',
  },
];
