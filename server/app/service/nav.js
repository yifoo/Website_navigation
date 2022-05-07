const Service = require('egg').Service

class NavService extends Service {
  async findSite(params) {
    try {
      const siteInfo = await this.app.mysql.select('nav_sites', { // 搜索 post 表
        where: params, // WHERE 条件
        columns: ['site_id', 'site_name','logo_id','sort_id'], // 要查询的表字段
        limit: 1 // 返回数据量
      });
      return siteInfo
    } catch (e) {
      console.log('e: ', e)
    }
  }
  async getLogo(params) {
    try {
      const logoSrc = await this.app.mysql.select('nav_logo', { // 搜索 post 表
        where: { logo_id:params.logo_id },
        columns: ['logo_id', 'logo_src'], // 要查询的表字段
        limit: 1 // 返回数据量
      });
      return logoSrc
    } catch (e) {
      console.log('e: ', e)
    }
  }
}

module.exports = NavService
