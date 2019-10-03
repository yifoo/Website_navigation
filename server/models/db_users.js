/*
 * @Author: wuhao
 * @Date: 2019-10-01 15:51:36
 * @Desc: 用户
 * @Last Modified by: wuhao
 * @Last Modified time: 2019-10-02 23:48:10
 */
import pool from "../config/pool";

const Users = {
  /**
   * 查询用户
   * @param {*} query
   */
  getUser: function (query) {
    const { uid, uname, email } = query;
    let sql = "";
    if (uid) {
      sql = `SELECT uid,uname,email,upwd,user_name userName,role FROM nav_users WHERE uid='${uid}'`;
    } else if (uname) {
      sql = `SELECT uid,uname,email,upwd,user_name userName,role FROM nav_users WHERE uname='${uname}'`;
    } else if (email) {
      sql = `SELECT uid,uname,email,upwd,user_name userName,role FROM nav_users WHERE email='${email}'`;
    } else {
      return {
        code: "-1",
        msg: "参数不能为空"
      };
    }
    return new Promise((resolve, reject) => {
      const param = pool.query(sql, function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data[0]);
      });
    });
  },
  /**
   * 创建用户
   * @param {*} query
   */
  createUser(query) {
    const { uname, upwd, email } = query;
    var sql = `INSERT INTO nav_users (uname,upwd,email,user_name,time) VALUES('${uname}','${upwd}','${email}','${decodeURIComponent(
      uname
    )}','${new Date().format('yyyy-MM-dd hh:mm:ss')}')`;
    return new Promise((resolve, reject) => {
      try {
        const param = pool.query(sql, function (err, data) {
          if (err) {
            reject(err);
          }
          resolve({
            code: "01",
            user: {
              uname,
              upwd,
              uid: data.insertId
            }
          });
        });
        console.log(param.sql);
      } catch (e) {
        console.log("新建用户", e);
        reject(false);
      }
    });
  },
  /**
   * 登录更新登录时间
   * @param {id} uid
   */
  login: function (uid) {
    let sql = `UPDATE nav_users SET login_time='${new Date().format('yyyy-MM-dd hh:mm:ss')}' WHERE uid=${uid}`;
    try {
      pool.query(sql, function (err, data) {
        if (err) {
          console.log("loginerr", err);
        }
      });
    } catch (e) {
      console.log("登录错误", e);
    }
  },
  /**
   * 更新密码
   * @param {id} uid
   * @param {upwd} upwd
   */
  updatePwd: function (uid, upwd) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE nav_users SET upwd='${upwd}' WHERE uid=${uid}`;
      try {
        pool.query(sql, function (err, data) {
          if (err) {
            console.log("修改密码错误", err);
          } else {
            resolve("01")
          }
        });
      } catch (e) {
        console.log("修改密码错误", e);
      }
    })

  },
  /**
   * 获取所有注册用户名
   */
  getAllUser: function () {
    return new Promise((resolve, reject) => {
      pool.query(
        {
          sql: "SELECT user_name userName,login_time loginTime FROM nav_users",
          timeout: 5000
        },
        function (err, data) {
          if (err) {
            throw err;
          } else {
            resolve(data);
          }
        }
      );
    });
  }
};
export default Users;
