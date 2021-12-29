
'use strict';

const Controller = require('egg').Controller;

class UsersController extends Controller {
  //验证登录并生成Token
  *doLogin() {
    const { ctx, app } = this;
    //获取用户端传递的参数
    const { uname, upwd } = ctx.request.body;
    //验证data数据，判断是否登录成功
    let result, funcList = {};
    try {
      result = yield app.mysql.query(`select u.user_name userName,u.uname,u.email,u.uid,r.rid from nav_users u left join nav_role r using(rid) where uname='${uname}' and upwd='${upwd}'`)
      if (result.length === 0) {
        ctx.body = { code: 402, msg: '登录失败' };
        return false
      } else {
        result = result[0]
        let func = yield app.mysql.query(`select fid from nav_role where rid=${result.rid}`)
        Object.keys(func).forEach(key => {
          funcList[func[key].fid] = 1
        })
      }
      const date = new Date()
      result.login_time = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      yield app.mysql.query(`UPDATE nav_users SET login_time='${result.login_time}' WHERE uid=${result.uid}`);
    } catch (err) {
      ctx.body = { code: 402, msg: '登录失败' };
      console.log('err: ', err);
    }
    //成功则生成Token
    //生成Token
    let token
    try {
      token = app.jwt.sign({ userName: result.userName, uname: result.uname, uid: result.uid, email: result.email, rid: result.rid }, app.config.jwt.secret, {
        expiresIn: 2592000, //设置一个月过期时间
      });
    } catch (err) {
      console.log('err: ', err);
    }
    //将生成的Token返回给前端
    ctx.body = { code: 200, msg: '登录成功', token, userInfo: { userName: result.userName, uname: result.uname, uid: result.uid, email: result.email, func: funcList } };;
  }
  //验证Token,获取用户信息
  *creatUser() {
    const { ctx, app } = this;
    //生成Token
    let token
    try {
      token = app.jwt.sign({ uid: 10001, rid: 10001 }, app.config.jwt.secret, {
        expiresIn: 3600, //设置一个月过期时间
      });
    } catch (err) {
      console.log('err: ', err);
    }
    ctx.body = { code: 200, msg: '获取用户信息成功', token, userInfo: { func: {} } };
  }
  //验证Token,获取用户信息
  *getUserInfo() {
    const { ctx, app } = this;
    const user = ctx.state.user
    let funcList = {};
    try {
      let func = yield app.mysql.query(`select fid from nav_role where rid=${user.rid}`)
      Object.keys(func).forEach(key => {
        funcList[func[key].fid] = 1
      })
    } catch (err) {
      console.log('err: ', err);
    }
    ctx.body = { code: 200, msg: '获取用户信息成功', userInfo: { userName: user.userName, uname: user.uname, uid: user.uid, email: user.email, func: funcList } };
  }
  //验证Token,获取用户信息
  *doLogout() {
    const { ctx, app } = this;
    let user
    try {
      user = ctx.state.user
      ctx.session = null;
    } catch (err) {
      console.log('err: ', err);
    }
    ctx.body = { code: 200, msg: '注销成功' };
  }
  //验证Token,获取用户信息
  *register() {
    const { ctx, app } = this;
    const { uname, upwd, email, userName, isInit } = ctx.request.body;
    let res;
    let date = new Date()
    try {
      const time = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      res = yield app.mysql.insert('nav_users', { uname, upwd, email, time, user_name: userName, rid: 10001 });
      if (res.insertId) {
        if (isInit) {
          let sites = yield app.mysql.select(`nav_sites`, { where: { is_com: 1 } })
          let sorts = yield app.mysql.select(`nav_sort`, { where: { is_com: 1 } })
          let initSites = `insert into nav_sites (sort_id,site_name,logo_id,site_url,site_tips,uid,order_index,is_com) values `
          sites.forEach((item, key) => {
            if (key === sites.length - 1) {
              initSites += `(${item.sort_id},'${item.site_name}',${item.logo_id},'${item.site_url}','${item.site_tips}',${res.insertId},${item.order_index},0)`
            } else {
              initSites += `(${item.sort_id},'${item.site_name}',${item.logo_id},'${item.site_url}','${item.site_tips}',${res.insertId},${item.order_index},0),`
            }
          })
          let initSorts = `insert into nav_sort (sort_id,sort_name,parent_id,order_index,color,uid,is_com) values `
          sorts.forEach((item, key) => {
            if (key === sorts.length - 1) {
              initSorts += `(${item.sort_id},'${item.sort_name}',${item.parent_id},${item.order_index},'${item.color}',${res.insertId},0)`
            } else {
              initSorts += `(${item.sort_id},'${item.sort_name}',${item.parent_id},${item.order_index},'${item.color}',${res.insertId},0),`
            }
          })
          let siteRes = yield app.mysql.query(initSites)
          let sortRes = yield app.mysql.query(initSorts)
          if (siteRes.affectedRows && sortRes.affectedRows) {
            ctx.body = { code: 200, msg: '注册并初始化网址成功' };
          } else {
            ctx.body = { code: 200, msg: '注册成功但初始化网址失败' };
          }
          return false
        } else {
          ctx.body = { code: 200, msg: '注册成功' };
          return false
        }
      }

    } catch (err) {
      console.log('err: ', err);
    }
    ctx.body = { code: 402, msg: '注册失败' };
  }
}
module.exports = UsersController;
