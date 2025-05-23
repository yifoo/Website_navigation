'use strict';

const Controller = require('egg').Controller;
const util = require('../../utils/util');
class SiteController extends Controller {
  // !获取所有分类
  * fetchSort() {
    // @ts-ignore
    const { ctx, app } = this;
    const { uid } = ctx.state.user;
    let res = [],
      sortList = [];
    try {
      res = yield ctx.service.nav.fetchSorts({ uid });
      sortList = util.sortArr(res);
    } catch (err) {
      console.log('err: ', err);
    }
    ctx.body = { code: 200, msg: '获取数据成功', data: sortList };
  }
  * fetchAll() {
    // @ts-ignore
    const { ctx, app } = this;
    const { uid } = ctx.state.user;
    let resp = [];
    try {
      resp = yield ctx.service.nav.fetchSites({ uid });
    } catch (err) {
      console.log('err: ', err);
    }
    ctx.body = { code: 200, msg: '获取数据成功', data: resp };
  }
  * querySite() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    const { uid } = ctx.state.user;
    // @ts-ignore
    const siteInfo = yield app.mysql.query(
      `select sort_id sortId,site_name siteName,site_id siteId from nav_sites where uid=${uid} and site_name like "%${params.siteName}%"`
    );
    if (siteInfo && siteInfo.length > 0) {
      ctx.body = { code: 200, msg: '当前网址已存在', data: siteInfo };
    } else {
      ctx.body = { code: 200, msg: '当前网址不存在', data: [] };
    }
  }
  * fetchAllCom() {
    const { ctx, app } = this;
    const uid = 10046;
    const sql = `select site.sort_id sortId,site.site_id siteId,site.site_name siteName,site.site_url siteUrl,site.site_desc siteDesc,logo.logo_id logoId,logo.logo_src logoSrc from nav_sites site
      left JOIN nav_logo logo USING(logo_id)  where site.uid=${uid} order by order_index`;
    let siteList;
    try {
      // @ts-ignore
      siteList = yield app.mysql.query(sql);
    } catch (err) {
      console.log('err: ', err);
    }
    ctx.body = { code: 200, msg: '获取数据成功', data: siteList };
  }
  * fetch() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    const { uid } = ctx.state.user;
    if (uid) {
      const sql = `select site.sort_id sortId,site.site_id siteId,site.site_name siteName,site.site_url siteUrl,site.site_desc siteDesc,site.tags tags,logo.logo_id logoId,logo.logo_src logoSrc,sort.sort_name sortName,sort.parent_id parentId from nav_sites site left JOIN nav_logo logo USING(logo_id) left join  nav_sort sort on  site.sort_id = sort.sort_id  and sort.uid=site.uid where site_id=${params.siteId} and site.uid=${uid}`;
      let res;
      try {
        // console.log('sql: ', sql)
        // @ts-ignore
        res = yield app.mysql.query(sql);
        if (res && res.length > 0) {
          res = res[0];
        }
        ctx.body = { code: 200, msg: '获取数据成功', data: res };
      } catch (err) {
        console.log('err: ', err);
      }
    } else {
      ctx.body = {
        code: '-1',
        msg: '参数不能为空',
      };
    }
  }
  // !获取所有未登录分类
  * fetchSortCom() {
    const { ctx, app } = this;
    const uid = 10046;
    let res,
      cateData;
    try {
      // @ts-ignore
      res = yield app.mysql.query(
        `select id,sort_id sortId,sort_name sortName,parent_id parentId,order_index orderIndex,color from nav_sort where uid = ${uid} order by orderIndex ASC`
      );
      cateData = util.sortArr(res);
    } catch (err) {
      console.log('err: ', err);
    }
    ctx.body = { code: 200, msg: '获取数据成功', data: cateData };
  }
  // !添加网址
  * addSite() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    const { uid } = ctx.state.user;
    let res,
      max,
      logoRes,
      logoInfo,
      logoId;
    try {
      // @ts-ignore
      logoInfo = yield app.mysql.select('nav_logo', {
        where: { logo_src: params.logoSrc },
      });
      if (logoInfo && logoInfo.length > 0) {
        logoId = logoInfo[0].logo_id;
      } else {
        // @ts-ignore
        logoRes = yield app.mysql.insert('nav_logo', {
          logo_src: params.logoSrc,
          site_name: params.siteName,
        });
        if (logoRes.insertId) {
          logoId = logoRes.insertId;
        } else {
          ctx.body = { code: 400, msg: '添加网址失败' };
        }
      }
      // @ts-ignore
      max = yield app.mysql.query(`select max(order_index) maxSiteOrderIndex from nav_sites where uid=${uid}`);
      // @ts-ignore
      res = yield app.mysql.insert('nav_sites', {
        uid,
        sort_id: params.sortId,
        site_name: params.siteName,
        logo_id: logoId,
        site_url: params.siteUrl,
        site_desc: params.siteDesc || '',
        tags: params.tags,
        order_index: max[0].maxSiteOrderIndex,
        count: 0,
      });
      if (res.affectedRows > 0) {
        ctx.body = { code: 200, msg: '添加网址成功' };
      } else {
        ctx.body = { code: 400, msg: '添加网址失败' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 400, msg: '添加网址失败' };
    }
  }
  * delSite() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    const { uid } = ctx.state.user;
    const sql = `Delete from nav_sites where uid=${uid} and site_id =${params.siteId} `;
    let res;
    try {
      // @ts-ignore
      res = yield app.mysql.query(sql);
      if (res.affectedRows > 0) {
        ctx.body = { code: 200, msg: '删除网址成功' };
      } else {
        ctx.body = { code: 400, msg: '删除网址失败' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 400, msg: '删除网址失败' };
    }
  }
  * updateSite() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    const { uid } = ctx.state.user;
    const sql = `UPDATE nav_sites site INNER JOIN nav_logo logo USING(logo_id) SET
    site.site_name='${params.siteName}', site.site_desc='${params.siteDesc || ''}',site.site_url='${params.siteUrl}',site.tags='${
  params.tags || ''
}',site.sort_id=${params.sortId},logo.logo_src='${params.logoSrc}'
    WHERE uid=${uid} and site.site_id=${params.siteId}`;
    console.log('sql: ', sql);
    let res;
    try {
      // @ts-ignore
      res = yield app.mysql.query(sql);
      if (res.changedRows > 0) {
        ctx.body = { code: 200, msg: '更新网址成功' };
      } else {
        ctx.body = { code: 400, msg: '没有更新' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 403, msg: '更新网址失败' };
    }
  }
  * clickSite() {
    // @ts-ignore
    const { ctx, app } = this;
    const { uid } = ctx.state.user;
    const params = ctx.request.body;
    let resp = [];
    try {
      resp = yield ctx.service.nav.ClickSites({ uid, siteId: params.siteId });
      if (resp.changedRows > 0) {
        ctx.body = { code: 200, msg: '' };
      } else {
        ctx.body = { code: 201, msg: '' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 202, msg: '' };
    }
  }
  * updateSiteOrder() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    const { uid } = ctx.state.user;
    let sql = 'insert into nav_sites (site_id,uid,order_index) values ';
    params.forEach((item, key) => {
      if (key === params.length - 1) {
        sql += `(${item.siteId},${uid},${item.index})`;
      } else {
        sql += `(${item.siteId},${uid},${item.index}),`;
      }
    });
    sql += ' on duplicate key update order_index=values(order_index);';
    console.log('sql: ', sql);
    let res;
    try {
      // @ts-ignore
      res = yield app.mysql.query(sql);
      if (res.affectedRows > 0) {
        ctx.body = { code: 200, msg: '更新网址排序成功' };
      } else {
        ctx.body = { code: 400, msg: '更新网址排序失败' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 400, msg: '更新网址排序失败' };
    }
  }
  // !添加二级分类
  * addSort() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    const { uid } = ctx.state.user;
    let res,
      max;
    try {
      // @ts-ignore
      max = yield app.mysql.query(`select max(sort_id) maxSortId,max(order_index) maxOrderIndex from nav_sort where uid=${uid}`);
      // @ts-ignore
      res = yield app.mysql.insert('nav_sort', {
        uid,
        sort_id: max[0].maxSortId + 1,
        parent_id: params.parentId,
        order_index: max[0].maxOrderIndex + 1,
        sort_name: params.sortName,
        color: params.color,
        is_com: uid === 10046 ? 1 : 0,
      });
      if (res.affectedRows > 0) {
        ctx.body = { code: 200, msg: '添加分类成功' };
      } else {
        ctx.body = { code: 400, msg: '添加分类失败' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 400, msg: '添加分类失败' };
    }
  }
  * updateSort() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    const { uid } = ctx.state.user;
    // *判断是否已经存在同名
    const sortInfo = yield ctx.service.nav.findSort({
      sort_name: params.sortName,
      parent_id: params.parentId,
      uid,
    });
    if (sortInfo.length !== 0) {
      ctx.body = { code: 201, msg: '已经存在相同分类' };
      return false;
    }
    let sql = `UPDATE nav_sort set sort_name='${params.sortName}'`;
    sql += params.parentId ? ` ,parent_id='${params.parentId}'` : '';
    sql += ` where uid=${uid} and sort_id =${params.sortId} `;
    let res;
    try {
      // @ts-ignore
      res = yield app.mysql.query(sql);
      if (res.changedRows > 0) {
        ctx.body = { code: 200, msg: '更新成功' };
      } else {
        ctx.body = { code: 400, msg: '更新失败' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 400, msg: '更新失败' };
    }
  }
  * updateSortColor() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    const { uid } = ctx.state.user;
    const sql = `UPDATE nav_sort set color='${params.color}' where sort_id=${params.sortId} OR parent_id =${params.sortId} and uid=${uid}`;
    let res;
    try {
      // @ts-ignore
      res = yield app.mysql.query(sql);
      if (res.changedRows > 0) {
        ctx.body = { code: 200, msg: '更新成功' };
      } else {
        ctx.body = { code: 400, msg: '更新失败' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 400, msg: '更新失败' };
    }
  }
  * updateSortOrder() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    const { uid } = ctx.state.user;
    let sql = 'insert into nav_sort (id,uid,order_index) values ';
    params.forEach((item, key) => {
      if (key === params.length - 1) {
        sql += `(${item.id},${uid},${item.index})`;
      } else {
        sql += `(${item.id},${uid},${item.index}),`;
      }
    });
    sql += ' on duplicate key update order_index=values(order_index);';
    let res;
    try {
      // @ts-ignore
      res = yield app.mysql.query(sql);
      if (res.affectedRows > 0) {
        ctx.body = { code: 200, msg: '更新分类排序成功' };
      } else {
        ctx.body = { code: 400, msg: '更新分类排序失败' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 400, msg: '更新分类排序失败' };
    }
  }

  * delSort() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    const { uid } = ctx.state.user;
    const sql = `Delete from nav_sort where uid=${uid} and sort_id =${params.sortId} `;
    let res;
    try {
      // @ts-ignore
      res = yield app.mysql.query(sql);
      if (res.affectedRows > 0) {
        ctx.body = { code: 200, msg: '删除分类成功' };
      } else {
        ctx.body = { code: 400, msg: '删除分类失败' };
      }
    } catch (err) {
      console.log('err: ', err);
      ctx.body = { code: 400, msg: '删除分类失败' };
    }
  }
  // !检查网址
  * checkSite() {
    // @ts-ignore
    const { ctx, app } = this;
    const params = ctx.request.body;
    const { uid } = ctx.state.user;
    let parseHtml = {};
    //* 存在网址id的情况下更新图标信息
    if (params.siteId) {
      parseHtml = yield util.getFavicon(params.siteUrl);
      if (parseHtml) {
        ctx.body = {
          code: 200,
          msg: '已获取解析图标和描述',
          data: parseHtml,
        };
      } else {
        ctx.body = {
          code: 400,
          msg: '网站访问存在问题',
        };
      }
      return false;
    }
    try {
      // *判断是否已经存在网址
      let siteInfo = yield ctx.service.nav.findSite({
        site_url: params.siteUrl,
      });
      if (siteInfo.length === 0) {
        // *不存在网址则解析得到图标并直接返回
        parseHtml = yield util.getFavicon(params.siteUrl);
        if (parseHtml) {
          ctx.body = {
            code: 200,
            msg: '已获取图标',
            data: parseHtml,
          };
        } else {
          ctx.body = {
            code: 400,
            msg: '网站服务存在问题',
          };
        }
        return false;
      }
      // *存在网址则查询网址所关联的图标
      siteInfo = siteInfo[0];
      parseHtml.logo = yield ctx.service.nav.getLogo({
        logo_id: siteInfo.logo_id,
      });
      if (parseHtml.logo && parseHtml.logo.length > 0) {
        parseHtml.logo = parseHtml.logo[0].logo_src;
        parseHtml.logoId = siteInfo.logo_id;
      }
      // *查询网址是否为当前账号名下的
      let userSiteInfo = yield ctx.service.nav.findSite({
        uid,
        site_url: params.siteUrl,
      });
      if (userSiteInfo.length === 0) {
        ctx.body = {
          code: 200,
          msg: '获取图标成功',
          data: {
            logo: [ parseHtml.logo ],
            desc: parseHtml.desc,
          },
        };
      } else {
        // * 属于账号名下返回账号名下的sortID和logo的图片地址
        userSiteInfo = userSiteInfo[0];
        ctx.body = {
          code: 200,
          msg: '当前网址已存在',
          data: {
            siteName: userSiteInfo.site_name,
            sortId: userSiteInfo.sort_id,
          },
        };
      }

    } catch (e) {
      console.log('checkSite: ', e);
    }
  }
  * pingSiteStatus() {
    // @ts-ignore
    const { ctx, app } = this;
    const params = ctx.request.query;
    try {
      const stdout = yield ctx.service.nav.getSiteStatus(params);
      ctx.body = { code: 200, msg: '请求成功', data: stdout };
    } catch (e) {
      ctx.body = { code: 402, msg: '请求失败', data: e };
    }
  }
}

module.exports = SiteController;
