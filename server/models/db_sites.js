/*
 * @Author: wuhao
 * @Date: 2019-10-01 15:51:26
 * @Desc: 网址
 * @Last Modified by: wuhao
 * @Last Modified time: 2020-03-08 21:57:34
 */
import pool from "../config/pool";

export const dbSites = {
  /**
   *
   * @param {*} uid 用户uid
   */
  getAllSites: function (uid) {
    let sql1, sql2, sql3;
    if (uid) {
      sql1 = `SELECT site.site_id siteId,site.site_index siteIndex,site.site_name siteName,site.site_url siteUrl,site.site_tips siteTips,img.src imgSrc,img.logo_id logoId, img.hasBig hasBig,site.sub_sort_id subSortId,site.site_tag siteTag `;
      sql1 += ` FROM nav_sites site,nav_img img WHERE site.uid='${uid}' and site.logo_id = img.logo_id ORDER BY site.site_index`;
      sql2 = `SELECT sort_id sortId,sub_sort_id subSortId,sub_title subTitle,sub_index subIndex FROM nav_subSort WHERE uid='${uid}' ORDER BY sub_index`;
      sql3 = `SELECT sort_id sortId,sort_name sortName,color,sort_index sortIndex FROM nav_sort WHERE uid='${uid}' ORDER BY sort_index`;
    } else {
      return {
        code: '-1',
        msg: '参数不能为空'
      }
    }
    // 获取有logo的所有sites
    var sites = new Promise((resolve, reject) => {
      const param = pool.query(sql1,
        function (err, data) {

          if (err) {
            reject(err)
          };
          resolve(data)
        })
    })
    // 获取二级分类
    var subSort = new Promise((resolve, reject) => {
      const param = pool.query(sql2,
        function (err, data) {
          if (err) {
            reject(err)
          };
          resolve(data)
        })
    })
    // 获取一级分类
    var sort = new Promise((resolve, reject) => {
      const param = pool.query(sql3,
        function (err, data) {
          if (err) {
            reject(err)
          };
          resolve(data)
        })
    })
    // 采用promise.all方法处理
    return new Promise((resolve, reject) => {
      Promise.all([sites, subSort, sort]).then((result) => {
        // 针对数据处理转换成为需要的格式
        var siteList = result[0],
          subSort = result[1],
          sort = result[2];
        subSort.map((item, index) => {
          item.siteList = []
          siteList.forEach((item2, index2) => {
            if (item2.subSortId === item.subSortId) {
              item.siteList.push(item2)
            }
          })
        })
        sort.map((item, index) => {
          item.subList = []
          subSort.forEach((item2, index2) => {
            if (item2.sortId === item.sortId) {
              item.subList.push(item2)
            }
          })
        })
        resolve(sort)
      }).catch((error) => {
        reject(error)
      })
    })
  },
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
   * 查询网址信息
   * @param {*} uid
   * @param {*} siteParam
   * @return 返回网址信息和logo
   */
  getSite(uid, siteParam) {
    let sql;
    if (uid) {
      sql = "SELECT sub_sort_id subSortId,site.site_id siteId,site.site_name siteName,site.site_url siteUrl,site.site_tips siteTips,logo.logo_id logoId,logo.src logoSrc ";
      sql += ` FROM nav_sites site,nav_img logo WHERE (site.site_id='${siteParam}' or site.site_url='${siteParam}') AND site.logo_id=logo.logo_id AND site.uid=${uid}`;
      return new Promise((resolve, reject) => {
        try {
          pool.query(sql,
            function (err, data) {
              if (err) {

                reject(err)
              };
              if (data && data.length > 0) {
                sql = `SELECT sort_id sortId,sub_title subTitle FROM nav_subSort WHERE sub_sort_id=${data[0].subSortId} `;
                pool.query(sql, function (subErr, subSortData) {
                  if (subErr) {

                    reject(subErr)
                  }
                  if (subSortData && subSortData.length > 0) {
                    sql = `SELECT sort_name sortName FROM nav_sort WHERE sort_id='${subSortData[0].sortId}' `;
                    pool.query(sql, function (sortErr, sortData) {
                      if (sortErr) {

                        reject(sortErr)
                      }
                      let resp = JSON.parse(JSON.stringify(data[0]))
                      resp.sortInfo = subSortData[0].subTitle + '/' + sortData[0].sortName + '/' + data[0].siteName
                      resolve(resp)
                    })
                  } else {
                    resolve()
                  }
                })
              } else {
                resolve()
              }
            })
        } catch (e) {

        }
      })
    } else {
      return {
        code: '-1',
        msg: '参数不能为空'
      }
    }
  },
  getLogoIdSrc(uid, siteInfo) {
    let sql;
    if (uid) {
      sql = `SELECT logo_id logoId FROM nav_sites WHERE site_url='${siteInfo.siteUrl}'`;
      return new Promise((resolve, reject) => {
        new Promise((resolve1, reject1) => {
          const param = pool.query(sql,
            function (err, data) {
              if (err) {
                reject1()
                return false
              } else {

                if (data.length > 0) {
                  resolve1(data[0])
                } else {
                  reject1()
                }
              };
            })
        })
          .then((result) => {
            var sql = `SELECT logo_id logoId,src logoSrc FROM nav_img WHERE logo_id=${result.logoId} `

            return new Promise((resolve2, reject2) => {
              pool.query(sql,
                function (err, data) {

                  if (err) {
                    reject(err)
                  };
                  if (data.length > 0) {
                    resolve(data[0])
                  } else {
                    resolve(false)
                  }
                })
            })
          }).catch(e => {

            resolve()
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
  updateSite(uid, siteInfo) {
    let sql1, sql2;
    if (uid) {
      sql1 = `UPDATE nav_sites SET site_name='${siteInfo.siteName}',site_url='${siteInfo.siteUrl}',site_tips= '${siteInfo.siteTips}',sub_sort_id='${siteInfo.subSortId}' `;
      sql1 += ` WHERE uid ='${uid}' AND site_id='${siteInfo.siteId}'`;
      var updateSiteInfo = new Promise((resolve, reject) => {
        const param = pool.query(sql1,
          function (err, data) {
            if (err) {
              reject(err)
            };
            // 返回影响的行数
            resolve(data.affectedRows)
          })
      })
      sql2 = `UPDATE nav_img SET src='${siteInfo.logoSrc}',site_name='${siteInfo.siteName}' WHERE logo_id='${siteInfo.logoId}'`;
      var updateLogoInfo = new Promise((resolve, reject) => {

        const param = pool.query(sql2,
          function (err, data) {
            if (err) {
              reject(err)
            };
            // 返回影响的行数
            resolve(data.affectedRows)
          })
      })
      return new Promise((resolve, reject) => {
        Promise.all([updateSiteInfo, updateLogoInfo]).then(result => {

          if (result[0] || result[1]) {
            resolve(result[0] || result[1])
          } else {
            reject(false)
          }
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
  insertSite(uid, siteInfo) {
    let sql;
    let {
      logoId,
      siteName,
      siteUrl,
      subSortId,
      siteTips,
      siteIndex
    } = siteInfo;
    if (uid) {
      sql = `INSERT INTO nav_sites ( sub_sort_id,site_name,site_url,site_tips,logo_id,uid,com_code,site_index) VALUES( '${subSortId}','${siteName}','${siteUrl}','${siteTips}','${logoId}','${uid}',1,${siteIndex})`;

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
   * 查询logo的地址
   * @param {*} logoSrc
   */
  getLogoSrc(logoSrc) {
    var sql = `SELECT logo_id logoId FROM nav_img WHERE src='${logoSrc}' `

    return new Promise((resolve, reject) => {
      pool.query(sql,
        function (err, data) {
          if (err) {
            reject(err)
          };
          if (data.length > 0) {
            resolve(data[0].logoId)
          } else {
            resolve(false)
          }
        })
    })
  },
  insertLogo(logoSrc, siteName) {
    var sql = `INSERT INTO nav_img (src,site_name) VALUES('${logoSrc}','${siteName}')`
    return new Promise((resolve, reject) => {
      pool.query(sql,
        function (err, data) {
          if (err) {
            reject(err)
          };
          resolve(data.insertId)
        })
    })
  },
  /**
   * *注册初始化用户数据方法
   * @param {*} uid
   */
  async initDb(uid, siteList) {
    var sql1, sql2, sql3;
    var count = 0;
    for (let i = 0; i < siteList.length; i++) {
      new Promise((resolve1, reject1) => {
        sql1 = `INSERT INTO nav_sort(sort_name,uid,color,com_code,sort_index) VALUES ('${siteList[i].sortName}',${uid},'${siteList[i].color}',1,${siteList[i].sortIndex})`
        pool.query(sql1,
          function (err, data1) {
            if (err) {
              reject1(err)
              return false;
            };
            // if (i == data.length - 1) {
            resolve1(data1.insertId)
            // }
          })
      }).then(sortId => {
        for (let j = 0; j < siteList[i].subList.length; j++) {
          new Promise((resolve2, reject2) => {
            sql2 = `INSERT INTO nav_subSort (sort_id,sub_title,uid,com_code,sub_index) VALUES (${sortId},'${siteList[i].subList[j].subTitle}',${uid},1,${siteList[i].subList[j].subIndex})`
            pool.query(sql2,
              function (err, data2) {
                if (err) {
                  reject2(err)
                };
                resolve2({
                  subSortId: data2.insertId,
                  sites: siteList[i].subList[j].siteList
                })
              })
          }).then(({
            subSortId,
            sites
          }) => {
            new Promise((resolve3, reject3) => {
              for (let k = 0; k < sites.length; k++) {
                sql3 = `INSERT INTO nav_sites(sub_sort_id,site_name,logo_id,site_url,site_tips,uid,com_code,site_index,site_tag) VALUES (${subSortId},'${sites[k].siteName}',${sites[k].logoId},'${sites[k].siteUrl}','${sites[k].siteTips}',${uid},1,${sites[k].siteIndex},'${sites[k].siteTag}')`
                pool.query(sql3,
                  function (err, data3) {
                    if (err) {
                      reject3(err)
                    };
                    if (k === sites.length - 1) {

                    }
                  })
              }
            })
          })
        }
      })
    }
  },
  /**
   * 更新网址数据
   * @param {number} uid
   * @param {number} siteId
   */
  delSite(uid, siteId) {
    let sql;
    sql = `DELETE FROM nav_sites WHERE site_id='${siteId}' AND uid='${uid}';`;
    return new Promise((resolve, reject) => {
      const param = pool.query(sql,
        function (err, data) {
          if (err) {
            reject(err)
          };
          // 返回影响的行数

          resolve(data.affectedRows)
        })
    })
  },


  updateSiteOrder(uid, siteList) {
    let sql, siteIndex = 0,
      count = 0;
    return new Promise((resolve, reject) => {
      while (siteIndex < siteList.length) {
        sql = `UPDATE nav_sites SET site_index='${siteIndex}' WHERE uid ='${uid}' AND site_id='${siteList[siteIndex].siteId}';`
        try {
          pool.query(sql,
            function (err, data) {
              if (err) {
                reject(err)
              };

              if (data.affectedRows == 1) {
                count++
              }
              if (count === siteList.length) {
                resolve(true)
              }
            })
        } catch (e) {

        }
        siteIndex++
      }
    })
  },


  /**
   * ! 删除所有网址,不对外
   * @param {} uid
   */
  delAllSites: function (uid) {
    let sql1, sql2, sql3;
    if (uid) {
      sql1 = `DELETE FROM nav_sort where uid="${uid}"`;
      sql2 = `DELETE FROM nav_subSort where uid="${uid}"`;
      sql3 = `DELETE FROM nav_sites where uid="${uid}"`;
    } else {
      return {
        code: '-1',
        msg: '参数不能为空'
      }
    }
    // 获取有logo的所有sites
    var sites = new Promise((resolve, reject) => {
      const param = pool.query(sql1,
        function (err, data) {
          if (err) {
            reject(err)
          };
          resolve(data.affectedRows)
        })
    })
    // 获取二级分类
    var subSort = new Promise((resolve, reject) => {
      const param = pool.query(sql2,
        function (err, data) {
          if (err) {
            reject(err)
          };
          resolve(data.affectedRows)
        })
    })
    // 获取一级分类
    var sort = new Promise((resolve, reject) => {
      const param = pool.query(sql3,
        function (err, data) {
          if (err) {
            reject(err)
          };
          resolve(data.affectedRows)
        })
    })
    // 采用promise.all方法处理
    return new Promise((resolve, reject) => {
      Promise.all([sites, subSort, sort]).then((result) => {

        resolve(true)
      }).catch((error) => {
        reject(error)
      })
    })
  },
}
