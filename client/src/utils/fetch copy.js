import { message } from 'antd';
import { fetch } from 'dva';
const bodyConnect = (body) => {
  let arr = Object.keys(body).map((each) => `${each}=${body[each]}`);
  return arr.length ? `&${arr.join('&')}` : '';
};
const injector_env = (url) => {
  if (url.indexOf('http') === -1) {
    return process.env.apiUrl + url;
  } else {
    return url;
  }
};
export default function request({ url = '', method = 'get', body = {}, options = {} }) {
  const token = localStorage.getItem('token');
  method = method.toLowerCase();
  url = injector_env(url);
  let params;
  options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    // credentials: 'include',
    ...options, //通用配置，可以覆盖所有的options参数列表，优先级最高
  };
  if (method === 'get') {
    params = [url + bodyConnect(body)];
  } else {
    // 支持 post|put|delete 等
    if (Array.isArray(body)) {
      options.body = JSON.stringify([...body]);
    } else {
      options.body = JSON.stringify({ ...body });
    }
    params = [url, options];
  }
  return fetch(...params)
    .then((res) => {
      if (res.status == 200) return res;
      if (window.navigator.onLine) {
        if (res.status === 401) {
          message.error('登录已失效,请重新登录');
        } else {
          message.error(`${res.status} ${res.statusText}`);
          console.log('`${res.status} ${res.statusText}`: ', `${res.status} ${res.statusText}`);
        }
      } else {
        message.error('网络异常，请检查网络设置');
      }
      return Promise.reject(res);
    })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      if (res.code == 200) {
        return res;
      } else if (!res.code) {
        return res;
      }
      return Promise.reject(res);
    })
    .catch((err) => {
      console.log('fetchErr: ', err);
      if (err.status === 401) {
        localStorage.clear('token');
      }
      return { code: err.code || err.status || 401, msg: err.msg || err.statusText };
      // return Promise.reject(err);
    });
}
// //specific methods
export const get = (param = {}) => request({ ...param, method: 'get' });
export const post = (param = {}) => request({ ...param, method: 'post' });
export const put = (param = {}) => request({ ...param, method: 'put' });
export const delete_ = (param = {}) => request({ ...param, method: 'delete' }); //delete为关键字,导出delete请求名加下划线作区分
