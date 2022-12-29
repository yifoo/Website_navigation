'use strict'

const Controller = require('egg').Controller
class SiteDicController extends Controller {
  *fetchTags() {
    // @ts-ignore
    const { ctx, app } = this
    const { uid } = ctx.state.user
    let res = []
    try {
      res = yield ctx.service.nav.fetchTags({ uid })
    } catch (err) {
      console.log('err: ', err)
    }
    ctx.body = { code: 200, msg: '获取数据成功', data: { tagsList: res } }
  }
}

module.exports = SiteDicController
