import { request } from 'umi';
// const headers = {
//   'Content-Type': 'application/json',
//   Authorization: `Bearer ${localStorage.getItem('token')}`,
// };
export async function login(body, options) {
  return request('/api/user/login', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function logout(options) {
  return request('/api/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}
export async function fetchUser(body, options) {
  return request('/api/user/getUserInfo', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function editUname(body, options) {
  return request('/api/user/editUname', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function checkUserEmail(body, options) {
  return request('/api/user/checkUserEmail', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function checkUname(body, options) {
  return request('/api/user/checkUname', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function sendCode(body, options) {
  return request('/api/user/sendCode', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function register(body, options) {
  return request('/api/user/register', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function editUpwd(body, options) {
  return request('/api/user/editUpwd', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function deleUser(body, options) {
  return request('/api/user/deleUser', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function queryUsers(body, options) {
  return request('/api/user/queryUsers', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function queryUserList(body, options) {
  return request('/api/user/queryUserList', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function queryRoleCode(body, options) {
  return request('/api/user/queryRoleCode', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function queryRoleList(body, options) {
  return request('/api/user/queryRoleList', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function saveUserRole(body, options) {
  return request('/api/user/saveUserRole', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
/**
 * 查询角色用户列表
 * @param {*} body
 * @param {*} options
 * @returns
 */
export async function queryRoleUserList(body, options) {
  return request('/api/user/queryRoleUserList', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function saveRoleAccess(body, options) {
  return request('/api/user/saveRoleAccess', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
