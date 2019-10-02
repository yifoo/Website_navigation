export default {
  comUid:1000000, //* 公共账号uid,便于管理公共网址
  initPwd:'12345678',//* 一个公共密码
  redis:{
    get host(){
      return '127.0.0.1'
    },
    get port(){
      return 6379
    }
  },
  smtp:{
    get host(){
      return 'smtp.qq.com'
    },
    get user(){
      return '1234567@qq.com'//*qq邮箱地址
    },
    get pass(){
      return 'asjdasdjkasdasdasd' //*qq邮箱密钥
    },
    get code(){
      return ()=>{
        return Math.random().toString(16).slice(2,6).toUpperCase()
      }
    },
    get limit(){
      return ()=>{
        return new Date().getTime()+60*1*1000
      }
    },
    get expire(){
      return ()=>{
        return new Date().getTime()+60*5*1000
      }
    }
  }
}
