import pool from "../config/pool"

const Search = {
  getSearch(){
    var sql1 = `SELECT sid,placeholder,key_active keyActive,text FROM nav_search where status=1 order by s_index`;
    var sql2 = `SELECT sid,sitem_active sitemActive ,name,query FROM nav_search_item where status=1 order BY sitem_index`;
    // 获取有logo的所有sites
    var search = new Promise((resolve, reject) => {
      pool.query(sql1,
        function (err, data) {
          if (err) {
            reject(err)
          };
          resolve(data)
        })
    })
    var searchItem = new Promise((resolve, reject) => {
      pool.query(sql2,
        function (err, data) {
          if (err) {
            reject(err)
          };
          resolve(data)
        })
    })
    // 采用promise.all方法处理
    return new Promise((resolve, reject) => {
      Promise.all([search, searchItem]).then((result) => {
        // 针对数据处理转换成为需要的格式
        var searchList = result[0],
          searchItemList = result[1];
          searchList.map((item, index) => {
            item.btn = []
            if(item.keyActive==1){
              item.keyActive = true
            }else{
              item.keyActive = false
            }
            searchItemList.forEach((item2, index2) => {
              if (item2.sid === item.sid) {
                if(item2.sitemActive==1){
                  item2.sitemActive = true
                }else{
                  item2.sitemActive = false
                }
                delete item2.sid
                item.btn.push(item2)
              }
            })
          })
        resolve(searchList)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  updateCount(params) {
    var _self = this
    const {
      uid,
      keyword
    } = params
    var count = 0,
      newCount;
    var sql = `SELECT count from nav_search_history WHERE uid="${uid}" AND keyword="${keyword}"`;
    return new Promise((resolve, reject) => {
      pool.query(sql, async function (error, data) {
        if (error) {
          reject(error)
        } else {
          if (data[0]&&data[0].count > 0) {
            count = data[0].count
            newCount = await _self.countAdd(count, params)
          } else {
            newCount = await _self.insertKeyword(params)
          }
          resolve(newCount)
        }
      })
    })
  },
  async insertKeyword(params) {
    const {
      uid,
      keyword
    } = params
    var sql = `INSERT INTO nav_search_history (uid,keyword,status,time,update_time) VALUES('${uid}','${keyword}',1,${new Date().getTime()},'${new Date().format('yyyy-MM-dd hh:mm:ss')}')`;
    console.log('sql: ', sql);
    try{
      return new Promise((resolve, reject) => {
        pool.query(sql, (error, data) => {
          if (error) {
            reject(error)
          } else {
            // kid = data.insertId
            resolve(data.insertId)
          }
        })
      })
    }catch(e){
      console.log('e: ', e);
    }
  },
  async countAdd(count, params) {
    const {
      uid,
      keyword
    } = params;
    count += 1
    var sql = `UPDATE nav_search_history SET count=${count},status=1,time=${new Date().getTime()},update_time='${new Date().format('yyyy-MM-dd hh:mm:ss')}' WHERE uid="${uid}" AND keyword="${keyword}"`;
    return new Promise((resolve, reject) => {
      pool.query(sql, (error, data) => {
        if (error) {
          throw error
        } else {
          resolve(count)
        }
      })
    })
  },
  async getHistory(ctx,uid) {
    let {keyword} = ctx.query
    var sql=''
    if(keyword){
      sql = `SELECT * from nav_search_history WHERE uid="${uid}" AND status=1 AND keyword LIKE '${keyword}%' ORDER BY time DESC LIMIT 0,10 `;
    }else{
      sql = `SELECT * from nav_search_history WHERE uid="${uid}" AND status=1 ORDER BY time DESC LIMIT 0,10 `;
    }
    return new Promise((resolve, reject) => {
      pool.query(sql, (error, data) => {
        if (error) {
          reject(error)
        } else {
          var newUid;
          if (ctx.isAuthenticated()) {
            newUid =ctx.session.passport.user.uid
          }
          if(uid===newUid){
            resolve(data)
          }else{
            resolve([])
          }
        }
      })
    })
  },
  /**
   * 删除历史搜索
   * @param {number} uid
   * @param {number} kid
   */
  delHistory(uid, kid) {
    let sql;
    sql = `UPDATE nav_search_history SET status=0 WHERE uid ='${uid}' AND kid='${kid}'`;
    return new Promise((resolve, reject) => {
      try {
        const param = pool.query(sql,
          function (err, data) {
            if (err) {
              reject(err)
            };
            // 返回影响的行数
            console.log('delHistory', data.affectedRows);
            resolve(data.affectedRows)
          })
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  },
}
export default Search
