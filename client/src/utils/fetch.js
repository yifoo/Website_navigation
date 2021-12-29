import { message } from 'antd';
import qs from 'qs';
import { extend } from 'umi-request';
const token = localStorage.getItem('token');
const instance = extend({
  prefix: process.env.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  paramsSerializer: function (params) {
    if (params instanceof FormData) {
      return params;
    } else {
      return qs.stringify(params);
    }
  },
  errorHandler: function (error) {
    const codeMap = {
      401: '登录已失效,请重新登录',
      500: '请求服务异常',
      502: '网络异常，请检查网络设置',
    };
    if (error.response) {
      if (window.navigator.onLine) {
        if (error.response.status === 401) {
          message.error('登录已失效,请重新登录');
        } else {
          message.error(`${error.response.status} ${error.response.statusText || codeMap[error.response.status]}`);
        }
      } else {
        message.error('网络异常，请检查网络设置');
      }
      // 请求已发送但服务端返回状态码非 2xx 的响应
      console.log(error.data);
      console.log(error.request);
      console.log(codeMap[error.data.status]);
    } else {
      // 请求初始化时出错或者没有响应返回的异常
      console.log(error.message);
    }

    throw error; // 如果throw. 错误将继续抛出.
    // 如果return, 则将值作为返回. 'return;' 相当于return undefined, 在处理结果时判断response是否有值即可.
    // return {some: 'data'};
  },
});

export const fetch = ({ url = '', method = 'get', ...options }) => {
  if (method === 'get') {
    options.params = options.body;
  } else {
    options.data = options.body;
  }
  return instance(url, { method, ...options }).then((res) => {
    if (res.code === 200) {
      return res;
    }
  });
};
export const fetchExport = ({ url = '', method = 'post', ...options }) => {
  options.data = options.body;
  instance.extendOptions({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
  });
  return instance(url, { method, ...options });
};
