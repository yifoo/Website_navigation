'use strict';

const Controller = require('egg').Controller;

class UsersController extends Controller {
  // 验证登录并生成Token
  * doLogin() {
    const { ctx, app } = this;
    // 获取用户端传递的参数
    const { uname, upwd } = ctx.request.body;
    // 验证data数据，判断是否登录成功
    let result;
    let roleInfo = {};
    console.log(
      `select u.user_name userName,u.uname,u.email,u.uid,r.id from nav_users u left join nav_role r on u.rid=r.id where u.uname='${uname}' and u.upwd='${upwd}'`
    );
    try {
      result = yield app.mysql.query(
        `select u.user_name userName,u.uname,u.email,u.uid,r.id from nav_users u left join nav_role r on u.rid=r.id where u.uname='${uname}' and u.upwd='${upwd}'`
      );
      if (result.length === 0) {
        const res = yield app.mysql.query(
          `select u.user_name userName,u.uname,u.email,u.uid,r.rid from nav_users u left join nav_role r on u.rid=r.id where u.uname='${uname}'`
        );
        if (res.length === 0) {
          ctx.body = { code: 400, msg: '用户不存在' };
        } else {
          ctx.body = { code: 400, msg: '密码错误' };
        }
        return false;
      }
      result = result[0];
      roleInfo = yield ctx.service.account.queryUserRole(result.uid);
      yield app.mysql.query(`UPDATE nav_users SET login_time=NOW() WHERE uid=${result.uid}`);
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 400, msg: '登录失败' };
    }
    // 成功则生成Token
    // 生成Token
    let token;
    try {
      token = app.jwt.sign(
        {
          userName: result.userName,
          uname: result.uname,
          uid: result.uid,
          email: result.email,
          rid: result.rid,
        },
        app.config.jwt.secret,
        {
          expiresIn: 2592000, // 设置一个月过期时间
        }
      );
    } catch (err) {
      console.log('err: ', err);
    }
    // 将生成的Token返回给前端
    ctx.body = {
      code: 200,
      msg: '登录成功',
      token,
      userInfo: {
        userName: result.userName,
        uname: result.uname,
        uid: result.uid,
        email: result.email,
        func: roleInfo.func,
        role: roleInfo.role,
        roleDesc: roleInfo.roleDesc,
        avatar: 'https://img.haohome.top/202205/huba.jpg',
      },
    };
  }
  // 验证Token,获取用户信息
  * creatUser() {
    const { ctx, app } = this;
    // 生成Token
    let token;
    try {
      token = app.jwt.sign({ uid: 10046, rid: 10000 }, app.config.jwt.secret, {
        expiresIn: 3600, // 设置一个月过期时间
      });
    } catch (err) {
      console.log('err: ', err);
    }
    ctx.body = {
      code: 200,
      msg: '获取用户信息成功',
      token,
      userInfo: { func: {} },
    };
  }
  // 验证Token,获取用户信息
  * deleUser() {
    const { ctx } = this;
    const params = ctx.request.body;
    let resp;
    try {
      resp = yield ctx.service.account.deleUser(params.uid);
      if (resp.length > 0 && resp[0].affectedRows > 0) {
        ctx.body = { code: 200, msg: '删除成功' };
      } else {
        ctx.body = { code: 400, msg: '删除失败' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 403, msg: '删除错误', err };
    }
  }
  // 验证Token,获取用户信息
  * getUserInfo() {
    const { ctx } = this;
    const user = ctx.state.user;
    let resp;
    try {
      resp = yield ctx.service.account.queryUserRole(user.uid);
    } catch (err) {
      console.log('err: ', err);
    }
    ctx.body = {
      code: 200,
      msg: '获取用户信息成功',
      userInfo: {
        ...resp,
        uid: user.uid,
        email: user.email,
        avatar: 'https://img.haohome.top/202205/huba.jpg',
      },
    };
  }
  // 验证Token,获取用户信息
  * doLogout() {
    const { ctx } = this;
    try {
      ctx.session = null;
    } catch (err) {
      console.log('err: ', err);
    }
    ctx.body = { code: 200, msg: '注销成功' };
  }
  // 验证Token,获取用户信息
  * register() {
    const { ctx, app } = this;
    const { uname, upwd, email, userName, isInit } = ctx.request.body;
    let res;
    try {
      res = yield app.mysql.query(
        `INSERT INTO nav_users (uname, upwd, email,user_name,rid,time) VALUES("${uname}", "${upwd}","${email}","${userName}", 102,NOW())`
      );
      if (res.insertId) {
        if (isInit) {
          const sites = yield app.mysql.select('nav_sites', {
            where: { is_com: 1 },
          });
          const sorts = yield app.mysql.select('nav_sort', {
            where: { is_com: 1 },
          });
          let initSites = 'insert into nav_sites (sort_id,site_name,logo_id,site_url,site_desc,uid,order_index,is_com) values ';
          sites.forEach((item, key) => {
            if (key === sites.length - 1) {
              initSites += `(${item.sort_id},'${item.site_name}',${item.logo_id},'${item.site_url}','${item.site_desc}',${res.insertId},${item.order_index},0)`;
            } else {
              initSites += `(${item.sort_id},'${item.site_name}',${item.logo_id},'${item.site_url}','${item.site_desc}',${res.insertId},${item.order_index},0),`;
            }
          });
          let initSorts = 'insert into nav_sort (sort_id,sort_name,parent_id,order_index,color,uid,is_com) values ';
          sorts.forEach((item, key) => {
            if (key === sorts.length - 1) {
              initSorts += `(${item.sort_id},'${item.sort_name}',${item.parent_id},${item.order_index},'${item.color}',${res.insertId},0)`;
            } else {
              initSorts += `(${item.sort_id},'${item.sort_name}',${item.parent_id},${item.order_index},'${item.color}',${res.insertId},0),`;
            }
          });
          const siteRes = yield app.mysql.query(initSites);
          const sortRes = yield app.mysql.query(initSorts);
          if (siteRes.affectedRows && sortRes.affectedRows) {
            ctx.body = { code: 200, msg: '注册并初始化网址成功' };
          } else {
            ctx.body = { code: 200, msg: '注册成功但初始化网址失败' };
          }
          return false;
        }
        ctx.body = { code: 200, msg: '注册成功' };
        return false;
      }
    } catch (err) {
      console.log('err: ', err);
    }
    ctx.body = { code: 400, msg: '注册失败' };
  }
}
module.exports = UsersController;
