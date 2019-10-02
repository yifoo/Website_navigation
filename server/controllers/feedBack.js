import Router from 'koa-router';
import dbFeedback from '../models/db_feedBack'

let router = new Router({
  prefix: '/feedBack'
})

router.post('/submit', async (ctx) => {
  if (ctx.isAuthenticated()) {
    const uid = ctx.session.passport.user.uid
    let {
      content
    } = ctx.request.body
    try {
      var feedId = await dbFeedback.insert({
        uid,
        content
      })
      if(feedId){
        ctx.body = {
          code: "01",
          msg: "谢谢您的反馈,我将做的更好",
          respData: {}
        }
      }else{
        ctx.body = {
          code: "00",
          msg: "反馈失败",
          respData: {}
        }
      }
    }catch(e){
      console.log('提交反馈失败',e)
      ctx.body = {
        code: "-1",
        msg: "反馈失败",
        respData: {}
      }
    }
  }else{
    ctx.body = {
      code: "-9",
      msg: "请登录后反馈",
      respData: {}
    }
  }
})

export default router
