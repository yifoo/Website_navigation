const Service = require('egg').Service

class NavService extends Service {
  async fetchSorts(params) {
    try {
      // @ts-ignore
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
      // @ts-ignore
      const siteInfo = await this.app.mysql
        .query(`select site.sort_id sortId,site.site_id id,site.site_name siteName,site.site_url siteUrl,site.site_desc siteDesc,site.tags tags,logo.logo_id logoId,logo.logo_src logoSrc from nav_sites site
        left JOIN nav_logo logo USING(logo_id)  where site.uid=${params.uid} order by order_index`)
      console.timeEnd('site')
      return siteInfo
    } catch (e) {
      console.log('e: ', e)
    }
  }
  //* 获取tags词典
  async fetchTags(params) {
    try {
      // @ts-ignore
      // 获得一个
      const tagsList = await this.app.mysql.query(`select tags from nav_sites where uid=${params.uid} group by tags`)
      let list =
        tagsList.length &&
        tagsList.map((item) => {
          if (item.tags) {
            return item.tags
          }
        })
      list = list.join(',').split(',')
      list = Array.from(new Set(list))
      list.shift()
      return list
    } catch (e) {
      console.log('e: ', e)
    }
  }
  async findSort(params) {
    try {
      // @ts-ignore
      const sortInfo = await this.app.mysql.select('nav_sort', {
        // 搜索 post 表
        where: params, // WHERE 条件
        columns: ['sort_id', 'sort_name', 'uid'], // 要查询的表字段
        limit: 1 // 返回数据量
      })
      return sortInfo
    } catch (e) {
      console.log('e: ', e)
    }
  }
  async findSite(params) {
    try {
      // @ts-ignore
      const siteInfo = await this.app.mysql.select('nav_sites', {
        // 搜索 post 表
        where: params, // WHERE 条件
        columns: ['site_id', 'site_name', 'logo_id', 'sort_id', 'site_desc'], // 要查询的表字段
        limit: 1 // 返回数据量
      })
      return siteInfo
    } catch (e) {
      console.log('e: ', e)
    }
  }
  /**
   * *记录网址点击次数
   * @param {网址信息} params
   * @returns siteInfo
   */
  async ClickSites(params) {
    try {
      // @ts-ignore
      const siteInfo = await this.app.mysql.query(
        `update nav_sites set count=count+1 where uid=${params.uid} and site_id = ${params.siteId}`
      )
      return siteInfo
    } catch (e) {
      console.log('e: ', e)
    }
  }
  async getSiteStatus(params) {
    try {
      const util = require('util')
      const exec = util.promisify(require('child_process').exec)
      let curl = `curl -I -m 5 -s -w "%{http_code}" -o /dev/null  ${params.siteUrl}`
      const { stdout, stderr } = await exec(curl)
      return stdout
    } catch (e) {
      console.log('e: ', e)
    }
  }
  async getLogo(params) {
    try {
      // @ts-ignore
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
