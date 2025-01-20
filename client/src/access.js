/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
import routes from '../config/routes';
export default function access(initialState) {
  const { userInfo } = initialState || {};
  if (!userInfo)
    return {
      1001: (route) => true,
      1002: (route) => false,
      1003: (route) => false,
      1004: (route) => false,
      1005: (route) => false,
      1006: (route) => false,
    };
  let isGet = (route) => {
    if (userInfo.func) {
      return userInfo.func.includes(route.access);
    } else {
      return false;
    }
  };
  // 提取所有 access 值并生成对象
  const accessList = {};
  const extractAccess = (obj) => {
    if (obj.access) {
      accessList[obj.access] = isGet; // 为每个 access 值赋值一个空方法
    }
    if (obj.routes && Array.isArray(obj.routes)) {
      obj.routes.forEach((route) => extractAccess(route)); // 递归处理 routes
    }
  };
  routes.forEach((item) => extractAccess(item));
  return accessList;
}
