'use strict';

const Controller = require('egg').Controller;
class TagController extends Controller {
  //* 获取同步菜品信息列表
  async list() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    let sql = 'select SQL_CALC_FOUND_ROWS dishCode,dish,cateCode,category,src,small,口感,风味,品相,功效,地域,加工方式,原料,品牌,人群,其他卖点 from (select dish_code dishCode,dish_name dish,cate_id cateCode,concat_ws("/",大类,品类,细分类) category from dish_cate_list  where  ';
    sql += params.isOn === 'false' ? ` state=1 ` : ` state is not null `;
    if (new RegExp('[\u4E00-\u9FA5]+').test(params.dish)) {
      sql += params.dish ? ` and dish_name LIKE '%${params.dish.trim()}%' ` : ' ';
    } else {
      sql += params.dish ? `  and dish_code LIKE '%${params.dish.trim()}%' ` : ' ';
    }
    if (params.isSort === 'false') {
      sql += ` and 细分类 is null `;
    }
    //* 菜品分类
    let cateList = [];
    if (params.cate && params.cate.length > 0) {
      params.cate.forEach(item => {
        cateList.push(item[2]);
      });
    }
    cateList = "'" + cateList.join("','") + "'";
    sql += params.cate && params.cate.length > 0 ? ` AND cate_id in(${cateList}) ` : '';
    sql += ' ORDER BY 品类 DESC )c  left join (select id imgId,菜品编码 code,src,small,state imgEnable from dish_info_img where state=1 group by code,src,small,imgEnable,imgId) i on c.dishCode=i.code ';
    sql += ' left join (select dish_code,口感,风味,品相,功效,地域,加工方式,原料,品牌,人群,其他卖点 from dish_tag_list)t on c.dishCode=t.dish_code ';
    if (params.isTag === 'false') {
      sql += ' where c.dishCode not in (select dish_code from dish_tag_list)'
    }
    // if (params.isTag === 'false') {
    //   sql += 'where c.dishCode not in (select dish_code from dish_tag_list)'
    // }
    sql += `    limit ${(parseInt(params.page) - 1) * params.limit},${params.limit};SELECT FOUND_ROWS() total ;`;
    let result = []; let res = [];
    try {
      console.log('sql: ', sql);
      result = await app.mysql.query(sql);
      res = result[0]
      res.map(item => {
        if (!item['tag']) {
          item['tag'] = []
        }
        if (item['口感']) {
          item.tag.push(item['口感'])
        }
        if (item['风味']) {
          item.tag.push(item['风味'])
        }
        if (item['品相']) {
          item.tag.push(item['品相'])
        }
        if (item['地域']) {
          item.tag.push(item['地域'])
        }
        if (item['加工方式']) {
          item.tag.push(item['加工方式'])
        }
        if (item['原料']) {
          item.tag.push(item['原料'])
        }
        if (item['品牌']) {
          item.tag.push(item['品牌'])
        }
        if (item['人群']) {
          item.tag.push(item['人群'])
        }
        if (item['功效']) {
          item.tag.push(item['功效'])
        }
        if (item['其他卖点']) {
          item.tag.push(item['其他卖点'])
        }
      })

      ctx.body = { code: 200, data: { total: result[1].length > 0 ? result[1][0].total : 0, items: res }, status: 1, msg: '获取数据成功' };
    } catch (error) {
      ctx.body = { code: 201, data: { total: 0, items: [] }, status: 0, msg: '获取数据失败' };
    }
  }
  async multiSave() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    //* 菜品分类
    let dishCodeList = [];
    if (params.dishCodeList && params.dishCodeList.length > 0) {
      params.dishCodeList.map(item => {
        dishCodeList.push(item.dishCode);
      });
    }
    dishCodeList = "'" + dishCodeList.join("','") + "'";
    const result = await app.mysql.query(`update dish_cate_list set cate_id=${params.multiCate[2].id}, 大类='${params.multiCate[0].label}',品类='${params.multiCate[1].label}',细分类='${params.multiCate[2].label}' where dish_code in (${dishCodeList})`);
    if (result.changedRows > 0) {
      ctx.body = { code: 200, data: { status: 1, msg: '修改粉类成功' } };
    } else {
      ctx.body = { code: 200, data: { status: 0, msg: '没有修改' } };
    }
  }
  //* 保存菜品详情
  async saveTagDetail() {
    const { ctx, app } = this;
    const params = ctx.request.body;

    let count = 0;
    params.imgEnable = params.imgEnable === 'true' ? 1 : 0;
    params.originData.imgEnable = params.originData.imgEnable === '1' ? 1 : 0;
    if (params.originData.imgEnable !== params.imgEnable || params.originData.dish !== params.dish || params.originData.src !== params.src || params.originData.specs !== params.specs) {
      const infoSql = `update dish_info_img set 菜品名称='${params.dish}',src='${params.src || ''}',small='${params.small || params.src || ''}',state=${parseInt(params.imgEnable)} where id='${params.imgId}'`;
      const infoResult = await app.mysql.query(infoSql);
      if (infoResult.changedRows > 0) {
        count++;
      } else {
        const insertInfo = await app.mysql.query(`insert into dish_info_img(菜品编码,菜品名称,state,src,small) VALUES('${params.dishCode}','${params.dish}',1,'${params.src || ''}','${params.small || params.src || ''}')`);
        if (insertInfo.insertId) {
          count++;
        }
      }
    }
    params.isRawFull = params.isRawFull === 'true' ? 1 : 0;
    params.updateDate = params.updateDate ? `'${params.updateDate}'` : null
    if (params.originData.dish !== params.dish || params.originData.sort !== params.sort || params.originData.category !== params.category || params.originData.material !== params.material) {
      const sortSql = `update dish_sort set 品类='${params.sort}',大类='${params.category}',菜品名称='${params.dish}',原料='${params.material}' where 菜品编码='${params.dishCode}'`;
      const sortResult = await app.mysql.query(sortSql);
      if (sortResult.affectedRows > 0) {
        count++;
      } else {
        const insertSort = await app.mysql.query(`insert into dish_sort(菜品编码,大类,品类,菜品名称,原料,上架日期,state) VALUES('${params.dishCode}','${params.category}','${params.sort}','${params.dish}','${params.material}','${params.updateDate}',1)`);
        if (insertSort.insertId) {
          count++;
        }
      }
    }
    if (params.tag) {
      const resTag = await app.mysql.get('dish_tag_list', { dish_code: params.dishCode })
      let transferArr = function (arr) {
        var newArr = {}
        arr.forEach((item, index) => {
          if (!newArr[item[0]]) {
            newArr[item[0]] = [];
            newArr[item[0]].push(item[1])
          } else {
            newArr[item[0]].push(item[1])
          }
        })
        return newArr
      }
      let tagList = transferArr(params.tag)
      Object.keys(tagList).map(key => {
        tagList[key] = tagList[key].join(',')
      })
      let tagArr = ['口感', '风味', '品相', '功效', '地域', '加工方式', '原料', '品牌', '人群',  '其他卖点']
      tagArr.map((item, index) => {
        if (!tagList.hasOwnProperty(item)) {
          tagList[item] = null
        }
      })
      let tagResult = {}
      if (resTag && resTag.id) {
        tagList.id = resTag.id
        tagResult = await app.mysql.update('dish_tag_list', tagList)
      } else {
        tagList.dish_code = params.dishCode
        tagList.dish = params.dish
        tagResult = await app.mysql.insert('dish_tag_list', tagList)
      }
      if (tagResult.affectedRows === 1) {
        count++
      }

    }
    if (count > 0) {
      ctx.body = { code: 200, data: { status: 1, msg: '菜品信息更新成功' } };
    } else {
      ctx.body = { code: 200, data: { status: 0, msg: '菜品信息更新失败' } };
    }
  }
  //* 保存菜品详情
  async delTag() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    const res = await app.mysql.query(`select count(菜品编码) count from dish_info_img where 菜品编码='${params.dishCode || ''}' group by 菜品编码`);
    let sql = '';
    if (res[0].count > 1) {
      params.imgEnable = params.imgEnable === 'true' ? 1 : 0;
      sql = `delete from dish_info_img  where id=${params.imgId}`;
    } else {
      sql = `delete from dish_sort where sid=${params.id}`;
    }
    const result = await app.mysql.query(sql);
    if (result.affectedRows > 0) {
      ctx.body = { code: 200, data: { status: 1, msg: '删除成功' } };
    } else {
      ctx.body = { code: 200, data: { status: 0, msg: '删除失败' } };
    }
  }
  async getTag() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    const list = await app.mysql.select(`dish_tag_list`);
    ctx.body = { code: 200, data: { status: 1, items: list } };
  }
}

module.exports = TagController;
