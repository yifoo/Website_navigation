import { request } from 'umi';
export async function querySearchList(body, options) {
  return request('/api/nav/search/query', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function queryKeys(body, options) {
  return request('https://www.baidu.com/sugrec?ie=utf-8&json=1&prod=pc&from=pc_web', {
    method: 'GET',
    params: body,
    ...(options || {}),
  });
}
export async function querySite(body, options) {
  return request('/api/nav/site/querySite', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function updateActiveBtn(body, options) {
  return request('/api/nav/search/updateActiveBtn', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function delBtn(body, options) {
  return request('/api/nav/search/delBtn', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function fetchBtn(body, options) {
  return request('/api/nav/search/fetchBtn', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function updateBtn(body, options) {
  return request('/api/nav/search/updateBtn', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function addBtn(body, options) {
  return request('/api/nav/search/addBtn', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function saveExtra(body, options) {
  return request('/api/nav/search/saveExtra', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function delExtra(body, options) {
  return request('/api/nav/search/delExtra', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function updateKeyActive(body, options) {
  return request('/api/nav/search/updateKeyActive', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}


