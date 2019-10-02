var mysql = require('mysql');
var pool1  = mysql.createPool({
  host            : '127.0.0.1',
  user            : 'root',
  password        : 'root',
  port            : 3306,
  database        : 'nav',
  connectionLimit:10
});
var pool2  = mysql.createPool({
  host            : 'localhost',
  user            : 'root',
  password        : 'root',
  port            : 3306,
  database        : 'nav',
  connectionLimit:10
});
console.log("连接池创建完成,该连接池只会创建一次");
module.exports=process.env.NODE_ENV==='production'? pool1:pool2;