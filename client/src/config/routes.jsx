import {
  AimOutlined,
  BankOutlined,
  FileSearchOutlined,
  FundOutlined,
  HomeOutlined,
  LineChartOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import React from 'react';
const router = [
  {
    path: '/user',
    component: '@/pages/User/UserLayout',
    routes: [
      { path: '/user/login', component: '@/pages/User/Login' },
      { path: '/user/register', component: '@/pages/User/Register' },
    ],
  },
  {
    path: '/',
    component: '@/layouts/index',
    routes: [
      {
        name: '个人收藏夹',
        path: '/',
        exact: true,
        accessCode: '1001',
        icon: <HomeOutlined />,
        component: '@/pages/Nav',
      },
    ],
  },
];
export default router;
