'use strict';

const Controller = require('egg').Controller;
class SearchController extends Controller {
  *query() {
    const { ctx, app } = this;
    let sql = `select n.sid,n.placeholder, i.sitem_id,n.placeholder,n.text,i.name,i.query,i.sitem_active btnActive from nav_search n left join nav_search_item i using(sid) where n.status =1 and i.status=1 order by n.s_index,i.sitem_index ASC  `;
    let result = []
    try {
      console.log('sql: ', sql);
      result = yield app.mysql.query(sql);
      let list = [], i = 0
      result.forEach((item, key) => {
        if (list.length === 0) {
          list.push({
            sid: item.sid,
            placeholder: item.placeholder,
            title: item.text,
            btns: [
              { key: item.sitem_id,btnActive:item.btnActive, name: item.name, query: item.query },
            ]
          })
          i++

        } else {
          if (list[i - 1].sid === item.sid) {
            list[i - 1]['btns'].push(
              { key: item.sitem_id,btnActive:item.btnActive,  name: item.name, query: item.query },
            )
          } else {
            list.push({
              sid: item.sid,
              placeholder: item.placeholder,
              title: item.text,
              btns: [
                { key: item.sitem_id,btnActive:item.btnActive,  name: item.name, query: item.query },
              ]
            })
            i++
          }
        }
      })
      ctx.body = { code: 200, msg: '获取数据成功', data: { list: list } };
    } catch (e) {
      console.log('e: ', e);
      ctx.body = { code: 201, msg: '获取数据失败' };
    }
  }
}

module.exports = SearchController;
