import Redis from 'koa-redis';
import Router from 'koa-router';
import nodeMailer from 'nodemailer';
import config from '../config';
import {dbSites} from '../models/db_sites';
import dbUsers from '../models/db_users';
import passport from '../utils/passport';


let router = new Router({
  prefix: '/user'
})
let Store = new Redis().client

router.get('/getUser', async (ctx) => {
  if (ctx.isAuthenticated()) {
    const {
      uname,
      email,
      userName,
      role
    } = ctx.session.passport.user
    ctx.body = {
      code: "01",
      respData: {
        uname,
        email,
        userName,
        role
      }
    }
  } else {
    ctx.body = {
      code: "00",
      respData: {}
    }
  }
})
router.post('/check', async (ctx, next) => {
  let user = await dbUsers.getUser(ctx.request.body)
  var { uname } = ctx.request.body
  if (user && user.uid) {
    if (uname) {
      ctx.body = {
        code: "-1",
        msg: '该用户名已被注册'
      }
    } else {
      ctx.body = {
        code: "-1",
        msg: '该邮箱已被注册'
      }
    }
    return;
  } else {
    ctx.body = {
      code: "01",
      msg: ""
    }
  }
})
router.post('/verify', async (ctx, next) => {
  let user = await dbUsers.getUser(ctx.request.body)
  if (user && user.uid) {
    ctx.body = {
      code: "-1",
      msg: '该邮箱或用户名已被注册'
    }
    return;
  }
  let uname = ctx.request.body.uname
  const sendExpire = await Store.hget(`nodemail:${uname}`, 'limit')
  if (sendExpire && new Date().getTime() - sendExpire < 0) {
    ctx.body = {
      code: "-1",
      msg: '验证请求过于频繁，请于1分钟后尝试'
    }
    return false
  }
  let transporter = nodeMailer.createTransport({
    service: 'qq',
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass
    }
  })
  let codeInfo = {
    code: config.smtp.code(),
    expire: confg.smtp.expire(),
    limit: config.smtp.limit(),
    email: ctx.request.body.email,
    user: ctx.request.body.uname
  }
  let mailOptions = {
    from: `"认证邮件" <${config.smtp.user}>`,
    to: codeInfo.email,
    subject: '个人导航注册码',
    html: `您在个人导航注册，您的验证码是 <a style="color:red">${codeInfo.code}</a>，5分钟内有效! <br/>本邮件由系统自动发送，请勿回复!☺`
  }
  console.log(`nodemail:${codeInfo.user}`, 'code', codeInfo.code, 'expire', codeInfo.expire, 'email', codeInfo.email, 'limit', codeInfo.limit)
  try {
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('error: ', error);
        ctx.body = {
          code: "01",
          msg: '验证码发送失败,请稍后重试'
        }
        return false;
      } else {
        Store.hmset(`nodemail:${codeInfo.user}`, 'code', codeInfo.code, 'expire', codeInfo.expire, 'email', codeInfo.email, 'limit', codeInfo.limit)
      }
    })
  } catch (e) {
    ctx.body = {
      code: "01",
      msg: '验证码发送失败,请稍后重试'
    }
    return false;
  }
  ctx.body = {
    code: "01",
    msg: '验证码已发送，可能会有延时，有效期5分钟'
  }
})

router.post('/register', async (ctx) => {
  const {
    uname,
    code
  } = ctx.request.body;

  if (code) {
    const saveCode = await Store.hget(`nodemail:${uname}`, 'code')
    const saveExpire = await Store.hget(`nodemail:${uname}`, 'expire')
    console.log('saveExpire: ', saveCode, code, saveExpire);
    if (saveCode) {
      if (code.toLocaleLowerCase() === saveCode.toLocaleLowerCase()) {
        console.log('new Date().getTime() - saveExpire: ', new Date().getTime() - saveExpire);
        if (new Date().getTime() - saveExpire > 0) {
          ctx.body = {
            code: "-1",
            msg: '验证码已过期，请重新尝试'
          }
          return false
        }
      } else {
        ctx.body = {
          code: "-1",
          msg: '请填写正确的验证码'
        }
        return false
      }
    } else {
      ctx.body = {
        code: "-1",
        msg: '请先发送验证码'
      }
      return false;
    }
  } else {
    ctx.body = {
      code: "-1",
      msg: '请填写验证码'
    }
    return false
  }
  let user = await dbUsers.getUser(ctx.request.body)
  console.log('user: ', user);
  if (user && user.uid) {
    ctx.body = {
      code: "-1",
      msg: '该邮箱或用户名已被注册'
    }
    return false;
  }
  try {
    let nuser = await dbUsers.createUser(ctx.request.body)
    if (nuser) {
      try {
        //!获取公共账号的网址数据,初始化赋值给新注册用户
        var siteList = await dbSites.getAllSites(config.comUid)
        if (siteList && siteList.length > 0) {
          dbSites.initDb(nuser.user.uid, siteList)
          ctx.body = {
            code: "01",
            msg: '注册成功',
          }
        }
      } catch (e) {
        console.log(e)
        ctx.body = {
          code: "00",
          msg: '注册成功,但网址初始化失败'
        }
      }
    } else {
      ctx.body = {
        code: "-1",
        msg: '注册失败'
      }
    }
  } catch (e) {
    ctx.body = {
      code: "-1",
      msg: '注册失败'
    }
    console.log('e', e)
  }
})

router.post('/login', async (ctx, next) => {
  return passport.authenticate('local', function (err, user, info, status) {
    if (err) {
      ctx.body = {
        code: '-1',
        msg: err
      }
    } else {
      if (user) {
        ctx.body = {
          code: "01",
          msg: '登录成功',
          respData: {
            user
          }
        }
        dbUsers.login(user.uid)
        return ctx.login(user)
      } else {
        ctx.body = {
          code: '02',
          msg: info
        }
      }
    }
  })(ctx, next)
})
router.get('/logout', async (ctx, next) => {
  await ctx.logout()
  ctx.session = null
  ctx.body = 0;
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: "01",
      msg: "注销成功"
    }
  } else {
    ctx.body = {
      code: "-1",
      msg: "注销失败"
    }
  }
})
/**
 * ! 初始化网址数据接口,不对外接口
 * 将uid的网址数据删除,初始化为cid用户的网址
 */
router.get('/initDb', async (ctx, next) => {
  const { uid, cid, pwd } = ctx.query
  if (uid && pwd === config.initPwd) {
    var delInfo = await dbSites.delAllSites(uid)
    console.log('delInfo: ', delInfo);
    // 初始化用户网址数据
    try {
      var siteList = await dbSites.getAllSites(cid || config.comUid)
      if (siteList && siteList.length > 0) {
        dbSites.initDb(uid, siteList)
        ctx.body = {
          code: "01",
          msg: '初始化成功',
        }
      }
    } catch (e) {
      console.log(e)
      ctx.body = {
        code: "00",
        msg: '网址初始化失败'
      }
    }
  } else {
    ctx.body = {
      code: "-1",
      msg: '失败'
    }
  }
})


export default router
