import { fetch } from '@/utils/fetch';

export default {
  login: (params) => {
    return fetch({
      method: 'post',
      url: '/api/user/login',
      body: params,
    });
  },
  logout: (params) => {
    return fetch({
      method: 'post',
      url: '/api/user/logout',
      body: params,
    });
  },
  fetchUser: (params) => {
    return fetch({
      method: 'post',
      url: '/api/user/get',
      body: params,
    });
  },
  checkUserEmail: (params) => {
    return fetch({
      method: 'post',
      url: '/api/user/checkUserEmail',
      body: params,
    });
  },
  checkUname: (params) => {
    return fetch({
      method: 'post',
      url: '/api/user/checkUname',
      body: params,
    });
  },
  sendCode: (params) => {
    return fetch({
      method: 'post',
      url: '/api/user/sendCode',
      body: params,
    });
  },
  register: (params) => {
    return fetch({
      method: 'post',
      url: '/api/user/register',
      body: params,
    });
  },
};
