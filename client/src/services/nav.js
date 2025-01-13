import { request } from 'umi';
// const headers = {
//   'Content-Type': 'application/json',
//   Authorization: `Bearer ${localStorage.getItem('token')}`,
// };
export async function fetchAll(body, options) {
  return request('/api/nav/site/fetchAllSites', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function fetchAllCom(body, options) {
  return request('/api/nav/site/fetchAllCom', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function clickSite(body, options) {
  return request('/api/nav/site/clickSite', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function addSite(body, options) {
  return request('/api/nav/site/addSite', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function delSite(body, options) {
  return request('/api/nav/site/delSite', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function updateSite(body, options) {
  return request('/api/nav/site/updateSite', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function updateSiteOrder(body, options) {
  return request('/api/nav/site/updateSiteOrder', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function fetchSite(body, options) {
  return request('/api/nav/site/fetch', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function checkSite(body, options) {
  return request('/api/nav/site/checkSite', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function pingSiteStatus(body, options) {
  return request('/api/nav/site/pingSiteStatus', {
    method: 'GET',
    params: body,
    ...(options || {}),
  });
}
export async function fetchSort(body, options) {
  return request('/api/nav/site/fetchSort', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function fetchSortCom(body, options) {
  return request('/api/nav/site/fetchSortCom', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function addSort(body, options) {
  return request('/api/nav/site/addSort', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function updateSort(body, options) {
  return request('/api/nav/site/updateSort', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function delSort(body, options) {
  return request('/api/nav/site/delSort', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function updateSubSort(body, options) {
  return request('/api/nav/site/updateSubSort', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function addSubSort(body, options) {
  return request('/api/nav/site/addSubSort', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function updateSortOrder(body, options) {
  return request('/api/nav/site/updateSortOrder', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function updateSortColor(body, options) {
  return request('/api/nav/site/changeSortColor', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function updateSubSortOrder(body, options) {
  return request('/api/nav/site/updateSubSortOrder', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

//* 获取tags 词典
export async function fetchTagsDic(body, options) {
  return request('/api/nav/dic/fetchTags', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
