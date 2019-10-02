import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import UserModel from '../models/db_users'

passport.use(new LocalStrategy({
  usernameField: 'uname',
  passwordField: 'upwd'
}, async function (uname, upwd, done) {
  let userInfo = await UserModel.getUser({
    uname
  })
  console.log('userInfo', userInfo)
  if (userInfo != null) {
    if (userInfo.upwd === upwd) {
      return done(null, userInfo)
    } else {
      return done(null, false, '密码输入错误')
    }
  } else {
    return done(null, false, '用户不存在')
  }
}))

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(async function (user, done) {
  return done(null, user)
})


export default passport
