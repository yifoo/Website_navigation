const Service = require('egg').Service;
const { formatDate } = require('../utils/util');
class SearchService extends Service {
  mysqlApp = this.app.mysql;
  // @ts-ignore
  // @ts-ignore
  async querySearchList(params) {
    try {
      // @ts-ignore
      const list = await this.mysqlApp.query(
        `select n.key_active keyActive,n.sid, i.btn_id btnId,n.placeholder,n.title,i.name,i.query,i.icon,n.active_btn activeBtn,e.label,e.value,e.placeholder tips from nav_search n left join nav_search_item i using(sid) left join nav_search_extra e  USING(btn_id)  where n.status =1 and i.status=1 order by n.s_index ASC,i.btn_index ASC,e.e_index ASC `
      );
      return list;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async updateSbtnActive(params) {
    try {
      const btnInfo = await this.mysqlApp.query(`update nav_search set active_btn=${params.activeBtn} where sid=${params.sid}`);
      return btnInfo;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async delBtn(params) {
    try {
      // @ts-ignore
      const btnInfo = await this.mysqlApp.delete('nav_search_item', {
        btn_id: params.btnId
      });
      return btnInfo;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async fetchBtn(params) {
    try {
      // @ts-ignore
      const btnInfo = await this.mysqlApp.query(
        `select i.btn_id btnId,i.name,i.query,i.icon,i.btn_index btnIndex,e.id,e.value,e.label,e.placeholder,e.e_index eIndex from nav_search_item i left join nav_search_extra e using(btn_id) where btn_id=${params.btnId} order by e.e_index ASC`
      );
      return btnInfo;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async updateBtn(params) {
    try {
      // @ts-ignore
      const btnInfo = await this.mysqlApp.query(
        `update nav_search_item set name='${params.name || ''}',icon='${params.icon || ''}',query='${params.query || ''}',btn_index=${
          params.btnIndex
        } where btn_id=${params.btnId}`
      );
      return btnInfo;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async updateExtra(params) {
    try {
      // @ts-ignore
      const btnInfo = await this.mysqlApp.query(
        `update nav_search_extra set label='${params.label || ''}',value='${params.value || ''}',placeholder="${
          params.placeholder || ''
        }",e_index=${params.eIndex} where id=${params.id}`
      );
      return btnInfo;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async addBtn(params) {
    try {
      // @ts-ignore
      const btnInfo = await this.mysqlApp.insert('nav_search_item', {
        sid: params.sid,
        icon: params.icon,
        name: params.name,
        query: params.query,
        btn_index: 1,
        status: 1
      });
      return btnInfo;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async addExtra(params) {
    try {
      // @ts-ignore
      const btnInfo = await this.mysqlApp.insert('nav_search_extra', {
        value: params.value,
        label: params.label,
        placeholder: params.placeholder,
        btn_id: params.btnId,
        e_index: params.eIndex
      });
      return btnInfo;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async delExtra(params) {
    try {
      // @ts-ignore
      const btnInfo = await this.mysqlApp.delete('nav_search_extra', {
        id: params.id
      });
      return btnInfo;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  updateKeyActive(params = []) {
    try {
      // @ts-ignore
      let action1 = new Promise(async (resolve, reject) => {
        try {
          // @ts-ignore
          const res1 = await this.mysqlApp.query(`update nav_search set key_active=${params[0].keyActive} where sid=${params[0].sid}`);
          if (res1.changedRows > 0) {
            resolve(true);
          } else {
            reject(false);
          }
        } catch (e) {
          reject(e);
        }
      });
      // @ts-ignore
      let action2 = new Promise(async (resolve, reject) => {
        try {
          // @ts-ignore
          const res1 = await this.mysqlApp.query(`update nav_search set key_active=${params[1].keyActive} where sid=${params[1].sid}`);
          if (res1.changedRows > 0) {
            resolve(true);
          } else {
            reject(false);
          }
        } catch (e) {
          reject(e);
        }
      });
      return [action1, action2];
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async queryRecord(params) {
    try {
      // @ts-ignore
      const word = await this.mysqlApp.select('nav_search_history', {
        where: params, // WHERE 条件
        columns: ['kid', 'keyword', 'count', 'uid'], // 要查询的表字段
        limit: 10,
        orders: [
          ['count', 'desc'],
          ['uid', 'asc']
        ]
      });
      return word;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async updateRecord(params) {
    try {
      // @ts-ignore
      const info = await this.mysqlApp.query(
        `update nav_search_history set count=${params.count + 1},update_time=NOW() where kid=${params.kid} and uid=${params.uid}`
      );
      return info;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async delRecord(params) {
    try {
      // @ts-ignore
      const info = await this.mysqlApp.query(
        `update nav_search_history set is_show=0 where kid=${params.kid}`
      );
      return info;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async insertRecord(params) {
    try {
      // @ts-ignore
      const word = await this.mysqlApp.query(
        `INSERT INTO nav_search_history(keyword, uid, update_time) VALUES('${params.keyword}', ${params.uid}, NOW())`
      );
      return word;
    } catch (e) {
      console.log('e: ', e);
    }
  }
  async queryRecordList(params) {
    try {
      // @ts-ignore
      let sql = `select SQL_CALC_FOUND_ROWS navH.kid,navH.keyword,navH.count,navH.uid,DATE_FORMAT(navH.update_time, '%Y-%m-%d %H:%i:%s') updateTime,navU.user_name userName  from nav_search_history navH left join nav_users navU on navU.uid=navH.uid where navH.is_show=1 and navH.status=${params.status}`;
      if (params.keyword) {
        sql += ` and navH.keyword like "%${params.keyword || ''}%"  and navU.user_name like "%${params.userName || ''}%"`;
      }
      if (params.uid) {
        sql += ` and navU.uid=${params.uid} `;
      }

      sql += ` order by navH.count desc,navH.update_time desc limit ${(params.page - 1) * params.pageSize},${
        params.pageSize
      };SELECT FOUND_ROWS() total ;  `;
      console.log('sql: ', sql);
      const word = await this.mysqlApp.query(sql);
      return word;
    } catch (e) {
      console.log('e: ', e);
    }
  }
}

module.exports = SearchService;
