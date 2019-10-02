import Router from "koa-router";
import { dbSubSort } from "../models/do_subSort";

let router = new Router({
  prefix: "/subSort"
});
/**
 * *获取网址二级分类信息
 */
router.get("/get", async ctx => {
  var uid;
  if (ctx.isAuthenticated()) {
    uid = ctx.session.passport.user.uid;
    try {
      var subSortList = await dbSubSort.getSubSort(uid);
      if (subSortList && subSortList.length > 0) {
        ctx.body = {
          code: "01",
          msg: "获取成功",
          respData: {
            subSortList: subSortList
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
router.post("/insert", async ctx => {
  if (ctx.isAuthenticated()) {
    var uid = ctx.session.passport.user.uid;
    try {
      var newSubSortId = await dbSubSort.insertSubSort(uid, ctx.request.body);
      if (newSubSortId) {
        ctx.body = {
          code: "01",
          msg: "添加新分类成功",
          respData: { subSortId: newSubSortId }
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
 * *更新二级分类信息
 */
router.post("/edit", async ctx => {
  if (ctx.isAuthenticated()) {
    var uid = ctx.session.passport.user.uid;
    try {
      var updateInfo = await dbSubSort.updateSubSort(uid, ctx.request.body);
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
      var updateInfo = await dbSubSort.delSubSort(
        uid,
        ctx.request.body.subSortId
      );
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
        msg: "删除失败",
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
 * 更新二级分类排序
 */
router.post("/order", async ctx => {
  if (ctx.isAuthenticated()) {
    var uid = ctx.session.passport.user.uid;
    try {
      var updateInfo = await dbSubSort.updateSubOrder(
        uid,
        ctx.request.body.subList
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
