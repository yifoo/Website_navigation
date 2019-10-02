import Router from "koa-router";
import config from '../config';
import {dbSites} from "../models/db_sites";
import utils from "../utils/utils";

let router = new Router({
  prefix: "/sites"
});
/**
 * *获取所有网址
 */
router.get("/getAll", async ctx => {
  //* 默认未登录取公共账号网址
  var uid = config.comUid;
  if (ctx.isAuthenticated()) {
    uid = ctx.session.passport.user.uid;
  }
  try {
    var siteList = await dbSites.getAllSites(uid);
    if (siteList && siteList.length > 0) {
      ctx.body = {
        code: "01",
        msg: "获取成功",
        respData: {
          siteList: siteList
        }
      };
    } else {
      ctx.body = {
        code: -1,
        msg: "获取失败",
        respData: {
          siteList: []
        }
      };
    }
  } catch (error) {
    console.log(error);
  }
});

/**
 * *获取单个网址信息
 */
router.get("/get", async ctx => {
  var uid;
  if (ctx.isAuthenticated()) {
    uid = ctx.session.passport.user.uid;
    var siteParam = ctx.request.query.siteId || ctx.request.query.siteUrl;
    try {
      var siteInfo = await dbSites.getSite(uid, siteParam);
      if (siteInfo) {
        ctx.body = {
          code: "01",
          msg: "获取成功",
          respData: {
            siteInfo: siteInfo
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
  }
});
/**
 * *插入网址信息
 */
router.post("/insert", async ctx => {
  var reqData = ctx.request.body;
  var uid;
  if (ctx.isAuthenticated()) {
    uid = ctx.session.passport.user.uid;
    try {
      var siteInfo = await dbSites.getSite(uid, reqData.siteUrl);
      if (siteInfo) {
        console.log('siteInfo: ', siteInfo);
        ctx.body = {
          code: -1,
          msg: `网址已存在于${siteInfo.sortInfo}`
        };
        return false;
      }
    } catch (error) {
      console.log("查询site", error);
    }
    try {
      var logoId;
      if (reqData.logoSrc !== "https://raw.githubusercontent.com/yifoo/img-cloud/master/img/blankico.jpg") {
        logoId = await dbSites.getLogoSrc(reqData.logoSrc);
      }
      if (!logoId) {
        logoId = await dbSites.insertLogo(reqData.logoSrc, reqData.siteName);
      }
    } catch (error) {
      console.log(error);
    }
    try {
      reqData = Object.assign(reqData, { logoId: logoId });
      var insertSiteInfo = await dbSites.insertSite(uid, reqData);
      if (insertSiteInfo) {
        ctx.body = {
          code: "01",
          msg: "添加新网址成功",
          respData: { siteId: insertSiteInfo }
        };
      } else {
        ctx.body = {
          code: "-1",
          msg: "添加新网址失败,请重新添加"
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
 * *更新网址信息
 */
router.post("/edit", async ctx => {
  var uid;
  if (ctx.isAuthenticated()) {
    uid = ctx.session.passport.user.uid;
    try {
      var updateInfo = await dbSites.updateSite(uid, ctx.request.body);
      if (updateInfo) {
        ctx.body = {
          code: "01",
          msg: "更新成功",
          respData: updateInfo
        };
      } else {
        ctx.body = {
          code: "-1",
          msg: "获取失败"
        };
      }
    } catch (error) {
      console.log("错误", error);
    }
  } else {
    ctx.body = {
      code: "-9",
      msg: "登录过期"
    };
  }
});
/**
 * *删除网址
 */
router.post("/del", async ctx => {
  if (ctx.isAuthenticated()) {
    var uid = ctx.session.passport.user.uid;
    try {
      var delInfo = await dbSites.delSite(uid, ctx.request.body.siteId);
      if (delInfo) {
        ctx.body = {
          code: "01",
          msg: "删除成功",
          respData: delInfo
        };
      } else {
        ctx.body = {
          code: "00",
          msg: "删除失败"
        };
      }
    } catch (error) {
      console.log("error: ", error);
      ctx.body = {
        code: "00",
        msg: "删除失败",
        respData: error
      };
    }
  } else {
    ctx.body = {
      code: "-9",
      msg: "登录已过期"
    };
  }
});

/**
 * *校验网址信息
 */
router.get("/checkSite", async ctx => {
  var uid = config.comUid;
  if (ctx.isAuthenticated()) {
    uid = ctx.session.passport.user.uid;
    try {
      var siteInfo = await dbSites.getSite(uid, ctx.request.query.siteUrl);
      var logoInfo;
      logoInfo = await dbSites.getLogoIdSrc(uid, ctx.request.query);
      if (logoInfo) {
        ctx.body = {
          code: "01",
          msg: "获取成功",
          respData: { logoSrc: logoInfo.logoSrc, siteInfo }
        };
        return false;
      } else {
        let logoInfo = await utils.getHtml(ctx.request.query.siteUrl);
        if (logoInfo.logoSrc) {
          ctx.body = {
            code: "01",
            msg: "获取成功",
            respData: { logoSrc: logoInfo.logoSrc, mark: logoInfo.mark, siteInfo }
          };
        } else {
          ctx.body = {
            code: "00",
            msg: "获取logo失败",
            respData: { logoSrc: "https://raw.githubusercontent.com/yifoo/img-cloud/master/img/blankico.jpg", siteInfo }
          };
        }
      }
    } catch (error) {
      console.log("获取logo错误");
      ctx.body = {
        code: "00",
        msg: "获取logo错误",
        respData: { logoSrc: "https://raw.githubusercontent.com/yifoo/img-cloud/master/img/blankico.jpg", siteInfo }
      };
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
 * *更新网址排序
 */
router.post("/order", async ctx => {
  if (ctx.isAuthenticated()) {
    var uid = ctx.session.passport.user.uid;
    try {
      var updateInfo = await dbSites.updateSiteOrder(
        uid,
        ctx.request.body.siteList
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
