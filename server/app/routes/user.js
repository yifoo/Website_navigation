'use strict';
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt } = app;
  router.post('/api/user/login', controller.user.logReg.doLogin);
  router.post('/api/user/logout', jwt, controller.user.logReg.doLogout);
  router.post('/api/user/getUserInfo', jwt, controller.user.logReg.getUserInfo);
  router.post('/api/user/register', controller.user.logReg.register);
  router.post('/api/user/deleUser', jwt, controller.user.logReg.deleUser);

  router.post('/api/user/editUpwd', jwt, controller.user.account.editUpwd);

  router.get('/api/user/checkToken', jwt, controller.user.check.token);
  router.post('/api/user/checkUserEmail', controller.user.check.userEmail);
  router.post('/api/user/checkUname', controller.user.check.uname);
  router.post('/api/user/sendCode', controller.user.check.sendCode);
  router.post('/api/user/queryUsers', jwt, controller.user.account.queryUsers);
  router.post('/api/user/editUname', jwt, controller.user.account.editUname);
  router.post('/api/user/queryUserList', jwt, controller.user.account.queryUserList);
  router.post('/api/user/saveUserRole', jwt, controller.user.account.saveUserRole);
  router.post('/api/user/queryRoleCode', jwt, controller.user.account.queryRoleCode);
  router.post('/api/user/queryRoleList', jwt, controller.user.account.queryRoleList);
  router.post('/api/user/queryRoleUserList', jwt, controller.user.account.queryRoleUserList);
  router.post('/api/user/saveRoleAccess', jwt, controller.user.account.saveRoleAccess);
};
