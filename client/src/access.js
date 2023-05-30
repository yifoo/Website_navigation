/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState) {
  const { userInfo } = initialState || {};
  if (!userInfo)
    return {
      1001: (route) => true,
      1099: (route) => false,
    };
  let isGet = (route) => {
    return userInfo.func.includes(Number(route.access));
  };
  return {
    1001:  isGet,
    1099: isGet,
  };
}
