/*
 * @Author: wuhao
 * @Date: 2019-10-01 15:51:10
 * @Desc: 一级分类
 * @Last Modified by: wuhao
 * @Last Modified time: 2020-03-08 08:06:02
 */
import pool from "../config/pool";
export const dbSort = {
  /**
   * 查询网址分类信息
   * @param {*} uid
   */
  getSort(uid) {
    let sql;
    if (uid) {
      sql = `SELECT sort_id sortId,sort_name sortName,color,sort_index sortIndex FROM nav_sort WHERE uid=${uid} ORDER BY sortIndex`;
      return new Promise((resolve, reject) => {
        const param = pool.query(sql,
          function (err, data) {
            if (err) {
              reject(err)
            };
            resolve(data)
          })
      })
    } else {
      return {
        code: '-1',
        msg: '参数不能为空'
      }
    }
  },
    /**
   * 更新一级分类
   * @param {number} uid
   * @param {object} sortInfo
   */
  insertSort(uid, sortInfo) {
    let sql;
    let {
      sortName,
      color,
      sortIndex
    } = sortInfo;
    if (uid) {
      sql = `INSERT INTO nav_sort ( uid,com_code,sort_name,color,sort_index) VALUES( '${uid}',1,'${sortName}','${color}','${sortIndex}') `;
      return new Promise((resolve, reject) => {
        const param = pool.query(sql,
          function (err, data) {
            if (err) {
              reject(err)
            };
            // 返回影响的行数
            resolve(data.insertId)
          })
      })
    } else {
      return {
        code: '-1',
        msg: '参数不能为空'
      }
    }
  },
  /**
   * 更新网址数据
   * @param {number} uid
   * @param {object} siteInfo
   */
  updateSort(uid, sortInfo) {
    let sql;
    let {
      sortId,
      sortName,
    } = sortInfo;
    sql = `UPDATE nav_sort SET sort_name='${sortName}' `;
    sql += ` WHERE uid ='${uid}' AND sort_id='${sortId}'`;
    return new Promise((resolve, reject) => {
      const param = pool.query(sql,
        function (err, data) {
          if (err) {
            reject(err)
          };
          // 返回影响的行数
          console.log('updateSort', data.affectedRows)
          resolve(data.affectedRows)
        })
    })
  },
  /**
   * 更新一级分类顺序
   * @param {*} uid
   * @param {*} sortList
   */
  updateSortOrder(uid, sortList) {
    let sql, sortIndex = 0,
      count = 0;
    return new Promise((resolve, reject) => {
      while (sortIndex < sortList.length) {
        sql = `UPDATE nav_sort SET sort_index='${sortIndex}' WHERE uid ='${uid}' AND sort_id='${sortList[sortIndex].sortId}';`
        try {
          pool.query(sql,
            function (err, data) {
              if (err) {
                reject(err)
              };
              console.log('data.affectedRows: ', data.affectedRows);
              if (data.affectedRows == 1) {
                count++
              }
              if (count === sortList.length) {
                resolve(true)
              }
            })
        } catch (e) {
          console.log(e)
        }
        sortIndex++
      }
    })
  },

  /**
   * 更新网址数据
   * @param {number} uid
   * @param {number} subSortId
   */
  delSort(uid, sortId) {
    let sql;
    sql = `DELETE FROM nav_sort WHERE sort_id='${sortId}' AND uid='${uid}';`;
    return new Promise((resolve, reject) => {
      try {
        const param = pool.query(sql,
          function (err, data) {
            if (err) {
              reject(err)
            };
            // 返回影响的行数
            console.log('delSort', data.affectedRows);
            resolve(data.affectedRows)
          })
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  },
}
