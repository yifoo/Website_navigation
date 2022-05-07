import { message } from 'antd';
import qs from 'qs';
import { history } from 'umi';
import { extend } from 'umi-request';
const instance = extend({
  timeout: 15000,
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
          localStorage.clear('token');
          history.push('/user/login')
          message.error('登录已失效,请重新登录');
        } else {
          message.error(`${error.response.status} ${error.response.statusText || codeMap[error.response.status]}`);
        }
      } else {
        message.error('网络异常，请检查网络设置');
      }
      // 请求已发送但服务端返回状态码非 2xx 的响应
      console.log('error', error.request);
    } else {
      // 请求初始化时出错或者没有响应返回的异常
      error && console.log(error.message);
    }
    // throw error; // 如果throw. 错误将继续抛出.
    // 如果return, 则将值作为返回. 'return;' 相当于return undefined, 在处理结果时判断response是否有值即可.
    return {};
  },
});

export const fetch = ({ url = '', method = 'get', ...options }) => {
  if (method === 'get') {
    options.params = options.body;
  } else {
    options.data = options.body;
  }
  options.headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  options.responseType = 'json';
  options.prefix = process.env.apiUrl;
  return instance(url, { method, ...options }).then((res) => {
    return res;
  });
};
