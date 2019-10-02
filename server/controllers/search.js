import Router from 'koa-router';
import axios from '../utils/axios'
import dbSearch from '../models/db_search'
import config from '../config'

let router = new Router({
  prefix: '/search'
})
router.get("/get", async (ctx) => {
  try {
    var searchList = await dbSearch.getSearch()
    if (searchList && searchList.length > 0) {
      ctx.body = {
        code: "01",
        msg: "查询成功",
        respData: {
          searchList
        }
      }
    } else {
      ctx.body = {
        code: "-1",
        msg: '无历史记录'
      }
    }
  } catch (error) {
    console.log(error)
  }
})

router.get('/sug', async (ctx) => {
  let {
    keyword,
    type
  } = ctx.query
  let search = {};
  if (type === "goole") {
    ctx.body = ""
  } else {
    search.url = 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su';
    search.data = {
      wd: keyword,
      json: 1,
      ie: "UTF-8"
    };
    try {
      let {
        status,
        data
      } = await axios.get(search.url, {
        params: search.data
      })
      data = data.slice(0, -2).slice(17)
      console.log('自动搜搜', JSON.parse(data).s);
      ctx.body = JSON.parse(data).s
    } catch (error) {
      console.log(error)
    }
  }
})
router.post("/saveKeyword", async (ctx) => {
  var uid = config.comUid
  if (ctx.isAuthenticated()) {
    uid = ctx.session.passport.user.uid
  }
  const {
    keyword
  } = ctx.request.body
  try {
    var count = await dbSearch.updateCount({
      uid,
      keyword
    })
    if (count) {
      var data = await dbSearch.getHistory(ctx, uid)
      if (data.length > 0) {
        ctx.body = {
          code: "01",
          msg: "更新成功",
          respData: data
        }
      } else {
        ctx.body = {
          code: "00",
        }
      }
    } else {
      ctx.body = {
        code: "-1",
        msg: '更新失败'
      }
    }
  } catch (error) {
    console.log(error)
  }
})
router.get("/getHistory", async (ctx) => {
  if (ctx.isAuthenticated()) {
    const {
      uid
    } = ctx.session.passport.user
    try {
      var data = await dbSearch.getHistory(ctx, uid)
      if (data.length > 0) {
        ctx.body = {
          code: "01",
          msg: "查询成功",
          respData: data
        }
      } else {
        ctx.body = {
          code: "-1",
          msg: '无历史记录'
        }
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    ctx.body = {
      code: "02",
      msg: '当前未登陆'
    }
  }
})
/**
 * 删除二级分类信息
 */
router.post("/del/history", async (ctx) => {
  if (ctx.isAuthenticated()) {
    var uid = ctx.session.passport.user.uid
    try {
      var updateInfo = await dbSearch.delHistory(uid, ctx.request.body.kid)
      if (updateInfo) {
        ctx.body = {
          code: "01",
          msg: "删除成功",
          respData: updateInfo
        }
      } else {
        ctx.body = {
          code: "00",
          msg: '删除失败'
        }
      }
    } catch (error) {
      ctx.body = {
        code: "00",
        msg: '更新失败',
        respData: error
      }
    }
  } else {
    ctx.body = {
      code: "-1",
      msg: '请登录后操作'
    }
  }
})

export default router
