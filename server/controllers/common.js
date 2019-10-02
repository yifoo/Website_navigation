/*
 * @Author: wuhao
 * @Date: 2019-10-01 15:50:43
 * @Desc: 公共查询
 * @Last Modified by: wuhao
 * @Last Modified time: 2019-10-01 16:24:09
 */
import Router from "koa-router";
import config from '../config';
import dbSearch from "../models/db_search";
import { dbSites } from "../models/db_sites";
let router = new Router({
  prefix: "/com"
});
router.get("/all", async ctx => {
  var uid = config.comUid;
  if (ctx.isAuthenticated()) {
    uid = ctx.session.passport.user.uid;
  }
  try {
    var siteList = await dbSites.getAllSites(uid);
    var searchList = await dbSearch.getSearch();
    var info = {};
    info.siteList = siteList;
    info.searchList = searchList;
    if (info.siteList && info.siteList.length > 0) {
      ctx.body = {
        code: "01",
        msg: "查询成功",
        respData: info
      };
    } else {
      ctx.body = {
        code: "-1",
        msg: "查询失败",
        respData: {}
      };
    }
  } catch (error) {

  }
});

export default router;
