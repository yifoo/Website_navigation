'use strict'
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, jwt } = app
  router.post('/api/user/login', controller.user.logReg.doLogin)
  router.post('/api/user/logout', jwt, controller.user.logReg.doLogout)
  router.post('/api/user/get', jwt, controller.user.logReg.getUserInfo)
  router.post('/api/user/register', controller.user.logReg.register)

  router.get('/api/user/checkToken', jwt, controller.user.check.token)
  router.post('/api/user/checkUserEmail', controller.user.check.userEmail)
  router.post('/api/user/checkUname', controller.user.check.uname)
  router.post('/api/user/sendCode', controller.user.check.sendCode)
}
