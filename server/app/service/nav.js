const Service = require('egg').Service

class NavService extends Service {
  async fetchSorts(params) {
    try {
      const sortList = await this.app.mysql.query(
        `select id,sort_id sortId,sort_name sortName,parent_id parentId,order_index orderIndex,color from nav_sort where uid = ${params.uid}  order by parent_id ASC,order_index ASC`
      )
      return sortList
    } catch (e) {
      console.log('e: ', e)
    }
  }
  async fetchSites(params) {
    try {
      console.time('site')
      const siteInfo = await this.app.mysql
        .query(`select site.sort_id sortId,site.site_id id,site.site_name siteName,site.site_url siteUrl,site.site_desc siteDesc,logo.logo_id logoId,logo.logo_src logoSrc from nav_sites site
        left JOIN nav_logo logo USING(logo_id)  where site.uid=${params.uid} order by order_index`)
        console.timeEnd('site')
      return siteInfo
    } catch (e) {
      console.log('e: ', e)
    }
  }
  async findSite(params) {
    try {
      const siteInfo = await this.app.mysql.select('nav_sites', {
        // 搜索 post 表
        where: params, // WHERE 条件
        columns: ['site_id', 'site_name', 'logo_id', 'sort_id'], // 要查询的表字段
        limit: 1 // 返回数据量
      })
      return siteInfo
    } catch (e) {
      console.log('e: ', e)
    }
  }
  async ClickSites(params) {
    try {
      const siteInfo = await this.app.mysql.query(`update nav_sites set count=count+1 where uid=${params.uid} and site_id = ${params.siteId}`)
      return siteInfo
    } catch (e) {
      console.log('e: ', e)
    }
  }
  async getLogo(params) {
    try {
      const logoSrc = await this.app.mysql.select('nav_logo', {
        // 搜索 post 表
        where: { logo_id: params.logo_id },
        columns: ['logo_id', 'logo_src'], // 要查询的表字段
        limit: 1 // 返回数据量
      })
      return logoSrc
    } catch (e) {
      console.log('e: ', e)
    }
  }
}

module.exports = NavService
