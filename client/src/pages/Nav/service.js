import { fetch } from '@/utils/fetch';

export default {
  querySearchList: (params) => {
    return fetch({
      method: 'post',
      url: '/api/nav/search/query',
      body: params,
    });
  },
  queryKeys: (params) => {
    return fetch({
      method: 'get',
      url: 'https://www.baidu.com/sugrec?ie=utf-8&json=1&prod=pc&from=pc_web',
      body: params,
    });
  },
  fetchAll: (params) => {
    return fetch({
      method: 'post',
      url: '/api/nav/site/fetchAll',
      body: params,
    });
  },
  fetchAllCom: (params) => {
    return fetch({
      method: 'post',
      url: '/api/nav/site/fetchAllCom',
      body: params,
    });
  },
  fetchSite: (params) => {
    return fetch({
      method: 'post',
      url: '/api/nav/site/fetch',
      body: params,
    });
  },
  fetchSort: (params) => {
    return fetch({
      method: 'post',
      url: '/api/nav/site/fetchSort',
      body: params,
    });
  },
  fetchSortCom: (params) => {
    return fetch({
      method: 'post',
      url: '/api/nav/site/fetchSortCom',
      body: params,
    });
  },
  updateSite: (params) => {
    return fetch({
      method: 'post',
      url: '/api/nav/site/updateSite',
      body: params,
    });
  },
  updateSiteOrder: (params) => {
    return fetch({
      method: 'post',
      url: '/api/nav/site/updateSiteOrder',
      body: params,
    });
  },
  addSite: (params) => {
    return fetch({
      method: 'post',
      url: '/api/nav/site/addSite',
      body: params,
    });
  },
  updateSubSort: (params) => {
    return fetch({
      method: 'post',
      url: '/api/nav/site/updateSubSort',
      body: params,
    });
  },
  addSubSort: (params) => {
    return fetch({
      method: 'post',
      url: '/api/nav/site/addSubSort',
      body: params,
    });
  },
  addSort: (params) => {
    return fetch({
      method: 'post',
      url: '/api/nav/site/addSort',
      body: params,
    });
  },
  delSite: (params) => {
    return fetch({
      method: 'post',
      url: '/api/nav/site/delSite',
      body: params,
    });
  },
  delSort: (params) => {
    return fetch({
      method: 'post',
      url: '/api/nav/site/delSort',
      body: params,
    });
  },
  updateSort: (params) => {
    return fetch({
      method: 'post',
      url: '/api/nav/site/updateSort',
      body: params,
    });
  },
  updateSortOrder: (params) => {
    return fetch({
      method: 'post',
      url: '/api/nav/site/updateSortOrder',
      body: params,
    });
  },
  updateSubSortOrder: (params) => {
    return fetch({
      method: 'post',
      url: '/api/nav/site/updateSubSortOrder',
      body: params,
    });
  },
  checkSite: (params) => {
    return fetch({
      method: 'post',
      url: '/api/nav/site/checkSite',
      body: params,
    });
  },
};
