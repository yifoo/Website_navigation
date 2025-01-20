'use strict';

const Controller = require('egg').Controller;

class AccountController extends Controller {
  * queryUsers() {
    const { ctx, app } = this;
    let res;
    try {
      res = yield ctx.service.account.queryUsers();
      if (res.length > 0) {
        ctx.body = { code: 200, data: res, msg: '获取用户名单成功' };
      } else {
        ctx.body = { code: 201, msg: '获取用户名单失败' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 502, msg: err };
    }
  }
  * queryUserList() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    let res;
    try {
      res = yield ctx.service.account.queryUserList(params);
      if (res.length > 0) {
        ctx.body = { code: 200, data: res[0], total: res[1][0].total, msg: '获取用户列表成功' };
      } else {
        ctx.body = { code: 201, msg: '获取用户列表失败' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 502, msg: err };
    }
  }
  * saveUserRole() {
    const { ctx } = this;
    const params = ctx.request.body;
    let res;
    try {
      res = yield ctx.service.account.saveUserRole(params);
      if (res.affectedRows > 0) {
        ctx.body = { code: 200, msg: '更新成功' };
      } else {
        ctx.body = { code: 400, msg: '更新失败' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 403, msg: '更新错误', err };
    }
  }
  * queryRoleCode() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    let roleList;
    try {
      roleList = yield ctx.service.account.queryRoleCode(params);
      const result = [];

      roleList.forEach(role => {
        // 将 id 加入结果数组
        // result.push(role.id);

        // 如果 fids 不为 null，处理 fids
        if (role.fids) {
          const fidsArray = role.fids.split(',');
          fidsArray.forEach(fid => {
            result.push(`${role.id}-${fid}`);
          });
        }
      });

      if (result.length > 0) {
        ctx.body = { code: 200, data: result, msg: '获取角色权限成功' };
      } else {
        ctx.body = { code: 201, msg: '获取角色权限失败' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 502, msg: err };
    }
  }
  * queryRoleUserList() {
    const { ctx } = this;
    const params = ctx.request.body;
    let resp;
    try {
      resp = yield ctx.service.account.queryRoleUserList(params);
      // 用于存储处理后的结果
      const result = [];

      // 用于记录 rid 对应的索引
      const ridMap = {};

      // 遍历原始数组
      resp.forEach(item => {
        const { rid, fids, role, roleDesc, uid, uname, userName } = item;

        // 如果 rid 已经存在，则将 uid、uname、userName 添加到 children 中
        if (ridMap.hasOwnProperty(rid)) {
          const index = ridMap[rid];
          result[index].userList.push({ uid, uname, userName });
        } else {
          // 如果 rid 不存在，则创建新对象并添加到结果中
          ridMap[rid] = result.length; // 记录 rid 对应的索引
          result.push({
            rid,
            fids,
            role,
            roleDesc,
            userList: [{ uid, uname, userName }], // 初始化 children
          });
        }
      });
      if (resp.length > 0) {
        ctx.body = { code: 200, data: result, total: result.length, msg: '获取角色用户成功' };
      } else {
        ctx.body = { code: 201, msg: '获取角色用户失败' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 502, msg: err };
    }
  }
  /**
   * 查询权限功能列表
   */
  * queryRoleList() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    let res;
    try {
      res = yield ctx.service.account.queryRoleList(params);
      const { roleList, funcList } = res;
      // 1. 处理 funcList：嵌套 children
      const map = new Map();
      funcList.forEach(item => {
        map.set(item.id, { ...item, children: [] }); // 初始化 children 数组
      });

      funcList.forEach(item => {
        if (item.parentId !== null && map.has(item.parentId)) {
          map.get(item.parentId).children.push(map.get(item.id)); // 嵌套子元素
        }
      });

      // 过滤出顶层元素（parentId 为 null 的元素）
      const nestedFuncList = funcList.filter(item => item.parentId === null).map(item => map.get(item.id));

      // 2. 将 funcList 放入 roleList 的 children 数组中
      roleList.forEach(role => {
        role.children = JSON.parse(JSON.stringify(nestedFuncList)); // 深拷贝嵌套后的 funcList
      });

      // 3. 遍历 roleList，将 children 中每个元素的 id 值更新为与第一层级的 id 拼接值
      roleList.forEach(role => {
        const firstLevelId = role.id; // 第一层级的 id
        const updateIds = items => {
          items.forEach(item => {
            item.id = `${firstLevelId}-${item.id}`; // 拼接第一层级的 id
            if (item.id.includes('10061')) {
              item.disabled = true; // 如果 id 包含 1001，则添加 disabled 属性
            }
            if (item.children && item.children.length > 0) {
              updateIds(item.children); // 递归处理子元素
            }
          });
        };
        updateIds(role.children); // 更新 children 的 id
      });

      if (Object.keys(res).length > 0) {
        ctx.body = { code: 200, data: roleList, msg: '获取角色列表成功' };
      } else {
        ctx.body = { code: 201, msg: '获取角色列表失败' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 502, msg: err };
    }
  }
  * saveRoleAccess() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    const { uid } = ctx.state.user;
    let res;

    // 1. 初始化一个对象，用于存储分类结果
    const result = {};

    // 2. 遍历数组，分类整理
    params.forEach(item => {
      if (typeof item === 'string') {
        // 提取前缀（如 '1-'、'2-' 或 '3-'）
        const prefix = item.split('-')[0];
        // 提取所有 ID（如 '1001' 或 '10041'）
        const ids = item.split('-').slice(1).join(',');

        // 如果 result 中还没有该前缀的分类，则初始化
        if (!result[prefix]) {
          result[prefix] = new Set();
        }

        // 将 ID 添加到对应的分类中
        ids.split(',').forEach(id => result[prefix].add(id));
      }
    });

    // 3. 将 Set 转换为逗号分隔的字符串，并构建最终结果
    const finalResult = Object.keys(result).map(key => {
      const ids = Array.from(result[key]).join(',');
      return { [key]: ids };
    });
    try {
      res = yield ctx.service.account.saveRole(finalResult);
      if (res.length > 0) {
        ctx.body = { code: 200, msg: '保存角色权限成功' };
      } else {
        ctx.body = { code: 201, msg: '保存角色权限失败' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 502, msg: err };
    }
  }
  * editUname() {
    const { ctx } = this;
    const params = ctx.request.body;
    const { uid } = ctx.state.user;
    let res;
    try {
      res = yield ctx.service.account.queryUpwd(uid, params);
      console.log('res: ', res);
      if (res.length > 0) {
        res = yield ctx.service.account.editUname(uid, params);
        if (res.changedRows > 0) {
          ctx.body = { code: 200, msg: '用户名、昵称已更新' };
        } else {
          ctx.body = { code: 201, msg: '出故障了，用户用户名、昵称未更新' };
        }
      } else {
        ctx.body = { code: 202, msg: '用户密码不正确' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 502, msg: err };
    }
  }
  * editUpwd() {
    const { ctx } = this;
    const params = ctx.request.body;
    const { uid } = ctx.state.user;
    let res;
    try {
      res = yield ctx.service.account.queryUpwd(uid, params);
      if (res.length > 0) {
        res = yield ctx.service.account.editUpwd(uid, params);
        if (res.changedRows > 0) {
          ctx.body = { code: 200, msg: '用户密码已更新' };
        } else {
          ctx.body = { code: 201, msg: '用户密码未更新，请检查是否输入正确' };
        }
      } else {
        ctx.body = { code: 201, msg: '输入的旧密码不正确' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 502, msg: err };
    }
  }
}
module.exports = AccountController;
