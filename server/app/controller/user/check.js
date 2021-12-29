
'use strict';

const Controller = require('egg').Controller;

class UsersController extends Controller {

  //验证Token
  *token() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization.substring(7);
    let user = app.jwt.verify(token, ctx.app.config.jwt.secret)
    //打印的内容为：{ userID:'2345613', iat: 1602390850 }
    //iat为过期时间
    //userID是生成Token时传入的 需要存储的Token数据
    ctx.body = ctx.state.user;
  }
  //验证Token,获取用户信息
  *uname() {
    const { ctx, app } = this;
    const { uname } = ctx.request.body;
    let res
    try {
      res = yield app.mysql.select('nav_users', { where: { uname: `${uname}` } });
      if (res.length === 0) {
        ctx.body = { code: 200, msg: '登录名可以注册' };
        return false
      } else {
        ctx.body = { code: 402, msg: '登录名已被注册' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 502, msg: '请求错误' };
    }
  }
  *userEmail() {
    const { ctx, app } = this;
    const { email } = ctx.request.body;
    let res
    try {
      res = yield app.mysql.select('nav_users', { where: { email: `${email}` } });
      if (res.length === 0) {
        ctx.body = { code: 200, msg: '邮箱可以注册' };
        return false
      } else {
        ctx.body = { code: 402, msg: '邮箱已被注册' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 502, msg: '请求错误' };
    }
  }
  *sendCode() {
    const { ctx, app } = this;
    const { email } = ctx.request.body;
    let res
    try {
      res = yield app.mysql.select('nav_users', { where: { email: `${email}` } });
      if (res.length === 0) {
        ctx.body = { code: 200, msg: '邮箱可以注册' };
        return false
      } else {
        ctx.body = { code: 402, msg: '邮箱已被注册' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 502, msg: '请求错误' };
    }
  }
}
module.exports = UsersController;
