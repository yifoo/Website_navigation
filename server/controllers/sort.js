import Router from "koa-router";
import {dbSort} from "../models/db_sort";

let router = new Router({
  prefix: "/sort"
});


/**
 * *获取网址分类信息
 */
router.get("/get", async ctx => {
  var uid;
  if (ctx.isAuthenticated()) {
    uid = ctx.session.passport.user.uid;
    try {
      var sortList = await dbSort.getSort(uid);
      if (sortList && sortList.length > 0) {
        ctx.body = {
          code: "01",
          msg: "获取成功",
          respData: {
            sortList: sortList
          }
        };
      } else {
        ctx.body = {
          code: -1,
          msg: "获取失败"
        };
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    ctx.body = {
      code: "-9",
      msg: "登录已过期"
    };
    return false;
  }
});

/**
 * * 插入网址分类
 */
router.post("/insert", async ctx => {
  if (ctx.isAuthenticated()) {
    var uid = ctx.session.passport.user.uid;
    try {
      var newSortId = await dbSort.insertSort(uid, ctx.request.body);
      if (newSortId) {
        ctx.body = {
          code: "01",
          msg: "添加新分类成功",
          respData: { sortId: newSortId }
        };
      } else {
        ctx.body = {
          code: "00",
          msg: "添加新分类失败,请重新添加"
        };
      }
    } catch (e) {
      ctx.body = {
        code: "-1",
        msg: "添加新分类失败,请重新添加",
        respData: e
      };
    }
  } else {
    ctx.body = {
      code: "-9",
      msg: "请登录后操作"
    };
  }
});

/**
 * 更新二级分类信息
 */
router.post("/edit", async ctx => {
  if (ctx.isAuthenticated()) {
    var uid = ctx.session.passport.user.uid;
    try {
      var updateInfo = await dbSort.updateSort(uid, ctx.request.body);
      if (updateInfo) {
        ctx.body = {
          code: "01",
          msg: "更新成功",
          respData: updateInfo
        };
      } else {
        ctx.body = {
          code: "00",
          msg: "更新失败"
        };
      }
    } catch (error) {
      ctx.body = {
        code: "00",
        msg: "更新失败",
        respData: error
      };
    }
  } else {
    ctx.body = {
      code: "-9",
      msg: "请登录后操作"
    };
  }
});
/**
 * 删除二级分类信息
 */
router.post("/del", async ctx => {
  if (ctx.isAuthenticated()) {
    var uid = ctx.session.passport.user.uid;
    try {
      var updateInfo = await dbSort.delSort(uid, ctx.request.body.sortId);
      if (updateInfo) {
        ctx.body = {
          code: "01",
          msg: "删除成功",
          respData: updateInfo
        };
      } else {
        ctx.body = {
          code: "00",
          msg: "删除失败"
        };
      }
    } catch (error) {
      ctx.body = {
        code: "00",
        msg: "更新失败",
        respData: error
      };
    }
  } else {
    ctx.body = {
      code: "-9",
      msg: "请登录后操作"
    };
  }
});


/**
 * 更新一级分类排序
 */
router.post("/order", async ctx => {
  if (ctx.isAuthenticated()) {
    var uid = ctx.session.passport.user.uid;
    try {
      var updateInfo = await dbSort.updateSortOrder(
        uid,
        ctx.request.body.sortList
      );
      if (updateInfo) {
        ctx.body = {
          code: "01",
          msg: "重新排序成功",
          respData: updateInfo
        };
      } else {
        ctx.body = {
          code: "00",
          msg: "重新排序失败"
        };
      }
    } catch (error) {
      console.log("error: ", error);
      ctx.body = {
        code: "-1",
        msg: "重新排序失败",
        respData: error
      };
    }
  } else {
    ctx.body = {
      code: "-9",
      msg: "请登录后操作"
    };
  }
});


export default router;
