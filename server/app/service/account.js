const Service = require('egg').Service;

class UserService extends Service {
  mysqlApp = this.app.mysql;

  async queryUsers(uid, params) {
    try {
      // @ts-ignore
      const userInfo = await this.mysqlApp.select('nav_users', {
        columns: ['uid', 'uname', 'user_name'] // 要查询的表字段
      });
      return userInfo;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async deleUser(uid) {
    try {
      // @ts-ignore
      const resp = await this.mysqlApp.query(
        `Delete From nav_sites where uid=${uid};Delete From nav_sort where uid=${uid};Delete From nav_users where uid=${uid};`
      );
      return resp;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async queryUserRole(uid) {
    let func, role, roleDesc, uname, userName;
    try {
      // @ts-ignore
      const roleInfo = await this.mysqlApp.query(
        `select r.fids,r.name role,r.description roleDesc,u.uname,u.user_name userName from nav_role r left join nav_users u on u.rid=r.id where uid=${uid}`
      );
      if (roleInfo.length > 0) {
        func = roleInfo[0].fids.split(',');
        role = roleInfo[0].role;
        roleDesc = roleInfo[0].roleDesc;
        uname = roleInfo[0].uname;
        userName = roleInfo[0].userName;
      }
      return { func, role, roleDesc, uname, userName };
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async queryRoleUserList(uid) {
    let roleUser;
    try {
      // @ts-ignore
      roleUser = await this.mysqlApp.query(
        `select r.id rid,r.fids,r.name role,r.description roleDesc,u.uid,u.uname,u.user_name userName from nav_role r left join nav_users u on u.rid=r.id `
      );
      return roleUser;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async queryUserList(params) {
    try {
      // @ts-ignore
      let sql = `select SQL_CALC_FOUND_ROWS u.uname,u.uid,u.user_name userName,u.email,u.time regTime,u.login_time loginTime,r.id rid,r.name role,r.description roleDesc from nav_users u left join nav_role r on u.rid=r.id`;
      if (params.uid) {
        sql += `  where u.uid=${params.uid}`;
      }
      sql += ` order by u.uid asc,u.login_time desc limit ${(params.page - 1) * params.pageSize},${
        params.pageSize
      };SELECT FOUND_ROWS() total ;  `;
      console.log('sql: ', sql);
      const userInfo = await this.mysqlApp.query(sql);
      return userInfo;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async queryRoleList(params) {
    try {
      let sql1 = `select id,name,description,fids from nav_role  `;
      let sql2 = `select id,name,description,parent_id parentId from nav_func  `;
      const roleList = await this.mysqlApp.query(sql1);
      const funcList = await this.mysqlApp.query(sql2);
      return { roleList, funcList };
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async queryRoleCode(params) {
    try {
      let sql = `select id,name,description,fids from nav_role  `;
      const roleList = await this.mysqlApp.query(sql);
      return roleList;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async saveUserRole(params) {
    try {
      const role = await this.mysqlApp.query(`update nav_users set rid=${params.rid} where uid=${params.uid}`);
      return role;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async saveRole(params) {
    try {
      // @ts-ignore
      let sql = '';
      if (params.length > 0) {
        for (const obj of params) {
          for (const [key, value] of Object.entries(obj)) {
            sql += `update nav_role set fids="${value}" where id=${Number(key)};`;
          }
        }
        const resp = await this.mysqlApp.query(sql);
        console.log('sql: ', sql);
        return resp;
      }
      return [];
    } catch (e) {
      console.log('e: ', e);
    }
  }
  /**
   * *查询用户密码是否存在
   * @param {网址信息} params
   * @returns siteInfo
   */
  async queryUpwd(uid, params) {
    try {
      // @ts-ignore
      const userInfo = await this.mysqlApp.select('nav_users', {
        where: { uid, upwd: params.upwd },
        columns: ['uid'] // 要查询的表字段
      });
      return userInfo;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async editUpwd(uid, params) {
    try {
      // @ts-ignore
      const userInfo = await this.mysqlApp.query(`update nav_users set upwd="${params.upwd}" where uid=${uid}`);
      return userInfo;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async editUname(uid, params) {
    try {
      // @ts-ignore
      let sql = `update nav_users set `;
      if (params.uname) {
        sql += ` uname="${params.uname}"`;
      }
      if (params.uname && params.userName) {
        sql += `,`;
      }
      if (params.userName) {
        sql += `user_name="${params.userName}"`;
      }
      sql += ` where uid=${uid} `;
      console.log('sql: ', sql);
      const userInfo = await this.mysqlApp.query(sql);
      console.log('userInfo: ', userInfo);
      return userInfo;
    } catch (e) {
      console.log('e: ', e);
    }
  }
}

module.exports = UserService;
