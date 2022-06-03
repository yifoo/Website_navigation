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
  return request('/api/user/get', {
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
