import pool from "../config/pool"
export default {
  insert(params) {
    const {
      uid,
      content
    } = params
    var sql = `INSERT INTO nav_feed (uid,content,time) VALUES('${uid}','${content}','${new Date().format('yyyy-MM-dd hh:mm:ss')}')`;
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
}
