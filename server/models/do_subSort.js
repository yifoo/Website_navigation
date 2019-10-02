/*
 * @Author: wuhao
 * @Date: 2019-10-01 15:51:19
 * @Desc: 二级分类
 * @Last Modified by: wuhao
 * @Last Modified time: 2019-10-01 16:28:44
 */
import pool from "../config/pool";
export const dbSubSort ={

  /**
   * 查询网址分类信息
   * @param {*} uid
   */
  getSubSort(uid) {
    let sql;
    if (uid) {
      sql = `SELECT subSort.sort_id sortId,sort.sort_name sortName,subSort.sub_sort_id subSortId,subSort.sub_title subTitle,sub_index subIndex,sort_index sortIndex FROM nav_subSort subSort , nav_sort sort WHERE subSort.sort_id=sort.sort_id And subSort.uid='${uid}' ORDER BY sort.sort_index,subSort.sub_index`;
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
   * 更新二级分类
   * @param {number} uid
   * @param {object} siteInfo
   */
  insertSubSort(uid, subSortInfo) {
    let sql;
    let {
      subTitle,
      sortId,
      subIndex
    } = subSortInfo;
    if (uid) {
      sql = `INSERT INTO nav_subSort (sort_id,com_code,sub_title,uid,sub_index) VALUES( '${sortId}',1,'${subTitle}','${uid}',${subIndex}) `;
      return new Promise((resolve, reject) => {
        const param = pool.query(sql,
          function (err, data) {
            if (err) {
              reject(err)
            };
            // 返回影响的行数
            console.log('insertSubSort', data.insertId)
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
  updateSubSort(uid, sortInfo) {
    let sql;
    let {
      subTitle,
      subSortId,
      sortId,
    } = sortInfo;
    sql = `UPDATE nav_subSort SET sub_title='${subTitle}',sort_id='${sortId}' `;
    sql += ` WHERE uid ='${uid}' AND sub_sort_id='${subSortId}'`;
    return new Promise((resolve, reject) => {
      const param = pool.query(sql,
        function (err, data) {
          if (err) {
            reject(err)
          };
          // 返回影响的行数
          console.log('updateSubSort', data.affectedRows)
          resolve(data.affectedRows)
        })
    })
  },
  /**
   * 更新网址数据
   * @param {number} uid
   * @param {number} subSortId
   */
  delSubSort(uid, subSortId) {
    let sql;
    sql = `DELETE FROM nav_subSort WHERE sub_sort_id='${subSortId}' AND uid='${uid}';`;
    return new Promise((resolve, reject) => {
      const param = pool.query(sql,
        function (err, data) {
          if (err) {
            reject(err)
          };
          // 返回影响的行数
          console.log('delSubSort', data.affectedRows);
          resolve(data.affectedRows)
        })
    })
  },
  updateSubOrder(uid, subList) {
    let sql, subIndex = 0,
      count = 0;
    return new Promise((resolve, reject) => {
      while (subIndex < subList.length) {
        sql = `UPDATE nav_subSort SET sub_index='${subIndex}' WHERE uid ='${uid}' AND sub_sort_id='${subList[subIndex].subSortId}';`
        try {
          pool.query(sql,
            function (err, data) {
              if (err) {
                reject(err)
              };
              if (data.affectedRows == 1) {
                count++
              }
              if (count === subList.length) {
                resolve(true)
              }
            })
        } catch (e) {
          console.log(e)
        }
        subIndex++
      }
    })
  },
}
