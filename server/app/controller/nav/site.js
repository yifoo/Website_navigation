'use strict'

const Controller = require('egg').Controller
const util = require('../../utils/util')
let FaviconGet = require('../../utils/getFavicon')
let favicon = new FaviconGet({
  verboseMode: true
})
class SiteController extends Controller {
  /**
   *
   * @param {*} uid 用户uid
   */
  *fetchAll() {
    const { ctx, app } = this
    const { uid } = ctx.state.user
    let sql = `select site.sort_id sortId,site.site_id siteId,site.site_name siteName,site.site_url siteUrl,site.site_tips siteTips,logo.logo_id logoId,logo.logo_src logoSrc from nav_sites site
      left JOIN nav_logo logo USING(logo_id)  where site.uid=${uid} order by order_index`
    let siteList
    try {
      siteList = yield app.mysql.query(sql)
    } catch (err) {
      console.log('err: ', err)
    }
    ctx.body = { code: 200, msg: '获取数据成功', data: siteList }
  }
  /**
   *
   * @param {*} uid 用户uid
   */
  *fetchAllCom() {
    const { ctx, app } = this
    const uid = 10001
    let sql = `select site.sort_id sortId,site.site_id siteId,site.site_name siteName,site.site_url siteUrl,site.site_tips siteTips,logo.logo_id logoId,logo.logo_src logoSrc from nav_sites site
      left JOIN nav_logo logo USING(logo_id)  where site.uid=${uid} order by order_index`
    let siteList
    try {
      siteList = yield app.mysql.query(sql)
    } catch (err) {
      console.log('err: ', err)
    }
    ctx.body = { code: 200, msg: '获取数据成功', data: siteList }
  }
  *fetch() {
    const { ctx, app } = this
    const params = ctx.request.body
    const { uid } = ctx.state.user
    if (uid) {
      let sql = `select site.sort_id sortId,site.site_id siteId,site.site_name siteName,site.site_url siteUrl,site.site_tips siteTips,logo.logo_id logoId,logo.logo_src logoSrc,sort.sort_name sortName,sort.parent_id parentId from nav_sites site left JOIN nav_logo logo USING(logo_id) left join  nav_sort sort on  site.sort_id = sort.sort_id  and sort.uid=site.uid where site_id=${params.siteId} and site.uid=${uid}`
      let res
      try {
        console.log('sql: ', sql)
        res = yield app.mysql.query(sql)
        if (res && res.length > 0) {
          res = res[0]
        }
        ctx.body = { code: 200, msg: '获取数据成功', data: res }
      } catch (err) {
        console.log('err: ', err)
      }
    } else {
      ctx.body = {
        code: '-1',
        msg: '参数不能为空'
      }
    }
  }
  //!获取所有分类
  *fetchSort() {
    const { ctx, app } = this
    const params = ctx.request.body
    const { uid } = ctx.state.user
    let res, cateData
    try {
      console.log(
        'sql',
        `select id,sort_id sortId,sort_name sortName,parent_id parentId,order_index orderIndex,color from nav_sort where uid = ${uid} order by orderIndex ASC`
      )
      res = yield app.mysql.query(
        `select id,sort_id sortId,sort_name sortName,parent_id parentId,order_index orderIndex,color from nav_sort where uid = ${uid} order by orderIndex ASC`
      )
      cateData = util.sortArr(res)
    } catch (err) {
      console.log('err: ', err)
    }
    ctx.body = { code: 200, msg: '获取数据成功', data: cateData }
  }
  //!获取所有未登录分类
  *fetchSortCom() {
    const { ctx, app } = this
    const uid = 10001
    let res, cateData
    try {
      console.log(
        'sql',
        `select id,sort_id sortId,sort_name sortName,parent_id parentId,order_index orderIndex,color from nav_sort where uid = ${uid} order by orderIndex ASC`
      )
      res = yield app.mysql.query(
        `select id,sort_id sortId,sort_name sortName,parent_id parentId,order_index orderIndex,color from nav_sort where uid = ${uid} order by orderIndex ASC`
      )
      cateData = util.sortArr(res)
    } catch (err) {
      console.log('err: ', err)
    }
    ctx.body = { code: 200, msg: '获取数据成功', data: cateData }
  }
  //!添加网址
  *addSite() {
    const { ctx, app } = this
    const params = ctx.request.body
    const { uid } = ctx.state.user
    let res, max, logoRes, logoInfo, logoId
    try {
      logoInfo = yield app.mysql.select('nav_logo', {
        where: { logo_src: params.logoSrc }
      })
      if (logoInfo && logoInfo.length > 0) {
        logoId = logoInfo.logo_id
      } else {
        logoRes = yield app.mysql.insert('nav_logo', {
          logo_src: params.logoSrc,
          site_name: params.siteName
        })
        if (logoRes.insertId) {
          logoId = logoRes.insertId
        } else {
          ctx.body = { code: 402, msg: '添加网址失败' }
        }
      }
      max = yield app.mysql.query(
        `select max(order_index) maxSiteOrderIndex from nav_sites where uid=${uid}`
      )
      res = yield app.mysql.insert('nav_sites', {
        uid,
        sort_id: params.sortId,
        site_name: params.siteName,
        logo_id: logoId,
        site_url: params.siteUrl,
        site_tips: params.siteTips||'',
        order_index: max[0].maxSiteOrderIndex
      })
      if (res.affectedRows > 0) {
        ctx.body = { code: 200, msg: '添加网址成功' }
      } else {
        ctx.body = { code: 402, msg: '添加网址失败' }
      }
    } catch (err) {
      console.log('err: ', err)
      ctx.body = { code: 402, msg: '添加网址失败' }
    }
  }
  *delSite() {
    const { ctx, app } = this
    const params = ctx.request.body
    const { uid } = ctx.state.user
    let sql = `Delete from nav_sites where uid=${uid} and site_id =${params.siteId} `
    let res
    try {
      console.log('sql: ', sql)
      res = yield app.mysql.query(sql)
      if (res.affectedRows > 0) {
        ctx.body = { code: 200, msg: '删除网址成功' }
      } else {
        ctx.body = { code: 402, msg: '删除网址失败' }
      }
    } catch (err) {
      console.log('err: ', err)
      ctx.body = { code: 402, msg: '删除网址失败' }
    }
  }
  *updateSite() {
    const { ctx, app } = this
    const params = ctx.request.body
    const { uid } = ctx.state.user
    let sql = `UPDATE nav_sites site INNER JOIN nav_logo logo USING(logo_id) SET
    site.site_name='${params.siteName}', site.site_tips='${params.siteTips}',site.site_url='${params.siteUrl}',site.sort_id=${params.sortId},logo.logo_src='${params.logoSrc}'
    WHERE uid=${uid} and site.site_id=${params.siteId}`
    let res
    try {
      res = yield app.mysql.query(sql)
      if (res.changedRows > 0) {
        ctx.body = { code: 200, msg: '更新网址成功' }
      } else {
        ctx.body = { code: 402, msg: '更新网址失败' }
      }
    } catch (err) {
      console.log('err: ', err)
      ctx.body = { code: 402, msg: '更新网址失败' }
    }
  }
  *updateSiteOrder() {
    const { ctx, app } = this
    const params = ctx.request.body
    const { uid } = ctx.state.user
    let sql = `insert into nav_sites (site_id,uid,order_index) values `
    params.forEach((item, key) => {
      if (key === params.length - 1) {
        sql += `(${item.siteId},${uid},${item.index})`
      } else {
        sql += `(${item.siteId},${uid},${item.index}),`
      }
    })
    sql += ` on duplicate key update order_index=values(order_index);`
    console.log('sql: ', sql)
    let res
    try {
      res = yield app.mysql.query(sql)
      if (res.affectedRows > 0) {
        ctx.body = { code: 200, msg: '更新网址排序成功' }
      } else {
        ctx.body = { code: 402, msg: '更新网址排序失败' }
      }
    } catch (err) {
      console.log('err: ', err)
      ctx.body = { code: 402, msg: '更新网址排序失败' }
    }
  }
  //!添加二级分类
  *addSort() {
    const { ctx, app } = this
    const params = ctx.request.body
    const { uid } = ctx.state.user
    let res, max
    try {
      max = yield app.mysql.query(
        `select max(sort_id) maxSortId,max(order_index) maxOrderIndex from nav_sort where uid=${uid}`
      )
      res = yield app.mysql.insert('nav_sort', {
        uid,
        sort_id: max[0].maxSortId + 1,
        parent_id: params.parentId,
        order_index: max[0].maxOrderIndex + 1,
        sort_name: params.sortName,
        color: params.color
      })
      if (res.affectedRows > 0) {
        ctx.body = { code: 200, msg: '添加分类成功' }
      } else {
        ctx.body = { code: 402, msg: '添加分类失败' }
      }
    } catch (err) {
      console.log('err: ', err)
      ctx.body = { code: 402, msg: '添加分类失败' }
    }
  }
  *updateSort() {
    const { ctx, app } = this
    const params = ctx.request.body
    const { uid } = ctx.state.user
    let sql = `UPDATE nav_sort set sort_name='${params.sortName}'`
    sql += params.parentId ? ` ,parent_id='${params.parentId}'` : ''
    sql += ` where uid=${uid} and sort_id =${params.sortId} `
    let res
    try {
      res = yield app.mysql.query(sql)
      if (res.changedRows > 0) {
        ctx.body = { code: 200, msg: '更新分类成功' }
      } else {
        ctx.body = { code: 402, msg: '更新分类失败' }
      }
    } catch (err) {
      console.log('err: ', err)
      ctx.body = { code: 402, msg: '更新分类失败' }
    }
  }
  *updateSortOrder() {
    const { ctx, app } = this
    const params = ctx.request.body
    const { uid } = ctx.state.user
    let sql = `insert into nav_sort (id,uid,order_index) values `
    params.forEach((item, key) => {
      if (key === params.length - 1) {
        sql += `(${item.id},${uid},${item.index})`
      } else {
        sql += `(${item.id},${uid},${item.index}),`
      }
    })
    sql += ` on duplicate key update order_index=values(order_index);`
    console.log('sql: ', sql)
    let res
    try {
      res = yield app.mysql.query(sql)
      if (res.affectedRows > 0) {
        ctx.body = { code: 200, msg: '更新分类排序成功' }
      } else {
        ctx.body = { code: 402, msg: '更新分类排序失败' }
      }
    } catch (err) {
      console.log('err: ', err)
      ctx.body = { code: 402, msg: '更新分类排序失败' }
    }
  }

  *delSort() {
    const { ctx, app } = this
    const params = ctx.request.body
    const { uid } = ctx.state.user
    let sql = `Delete from nav_sort where uid=${uid} and sort_id =${params.sortId} `
    let res
    try {
      res = yield app.mysql.query(sql)
      if (res.affectedRows > 0) {
        ctx.body = { code: 200, msg: '删除分类成功' }
      } else {
        ctx.body = { code: 402, msg: '删除分类失败' }
      }
    } catch (err) {
      console.log('err: ', err)
      ctx.body = { code: 402, msg: '删除分类失败' }
    }
  }

  //!检查网址
  *checkSite() {
    const { ctx, app } = this
    const params = ctx.request.body
    const { uid } = ctx.state.user
    let siteInfo,
      logoInfo,
      logoSrc = {}
    let domainReg =
      /(http|https):\/\/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?\/?/i
    const getIcon = async () => {
      siteInfo = await app.mysql.query(
        `select logo_id from nav_sites where site_url = '${
          params.siteUrl.match(domainReg)[0]
        }' group by logo_id`
      )
      if (siteInfo && siteInfo.length > 0) {
        siteInfo = siteInfo[0]
        logoInfo = await app.mysql.select('nav_logo', {
          where: { logo_id: siteInfo.logo_id }
        })
        console.log('logoInfo: ', logoInfo)
        if (logoInfo && logoInfo.length > 0) {
          logoInfo = logoInfo[0]
          ctx.body = {
            code: 200,
            msg: `获取图标成功`,
            data: { logoId: logoInfo.logo_id, logoSrc: logoInfo.logo_src }
          }
          return false
        }
      }
      // logoSrc = await util.getHtml(ctx, params.siteUrl)
      try {
        logoSrc = await favicon.getFavicon(ctx, params.siteUrl)
      } catch (err) {
        console.log('err: ', err)
      }
      ctx.body = {
        code: 200,
        msg: `获取图标成功`,
        data: { logoSrc: logoSrc.path }
      }
      return false
    }
    const getIdIcon = async () => {
      let logoId = siteInfo[0].logo_id
      logoInfo = await app.mysql.select('nav_logo', {
        where: { logo_id: logoId }
      })
      if (logoInfo && logoInfo.length > 0) {
        logoInfo = logoInfo[0]
        ctx.body = {
          code: 200,
          msg: `获取图标成功`,
          data: { logoId: logoInfo.logo_id, logoSrc: logoInfo.logo_src }
        }
        return false
      } else {
        ctx.body = {
          code: 200,
          msg: `获取图标失败`,
          data: { logoId: logoInfo.logo_id, logoSrc: logoInfo.logo_src }
        }
        return false
      }
    }
    try {
      // 如果是编辑网址或更换网址
      if (params.siteId) {
        siteInfo = yield app.mysql.query(
          `select logo_id from nav_sites where site_url = '${params.siteUrl}' group by logo_id`
        )
        if (siteInfo && siteInfo.length > 0) {
          return getIdIcon()
        } else {
          return getIcon()
        }
      } else {
        siteInfo = yield app.mysql.query(
          `select sort_id sortId,site_name siteName from nav_sites where uid=${uid} and site_url='${params.siteUrl}'`
        )
        if (siteInfo && siteInfo.length > 0) {
          siteInfo = siteInfo[0]
          ctx.body = { code: 200, msg: `当前网址已存在`, data: siteInfo }
        } else {
          siteInfo = yield app.mysql.query(
            `select logo_id from nav_sites where site_url = '${params.siteUrl}' group by logo_id`
          )
          if (siteInfo && siteInfo.length > 0) {
            return getIdIcon()
          } else {
            return getIcon()
          }
        }
      }
    } catch (err) {
      console.log('err: ', err)
      ctx.body = { code: 402, msg: '获取图标失败' }
    }
  }
  *getIcon() {
    const { ctx, app } = this
    const params = ctx.request.body
    console.log('params: ', params)
    let domainReg =
      /(http|https):\/\/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/i
    let host = params.url.match(domainReg)[0]
    let res
    try {
      res = yield favicon.getFavicon(ctx, host)
    } catch (err) {
      console.log('err: ', err)
    }
    ctx.body = { res, host }
  }
}

module.exports = SiteController
