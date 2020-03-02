export default {
  comUid:100000,
  initPwd:'123456',
  // redis:{
  //   get host(){
  //     return '127.0.0.1'
  //   },
  //   get port(){
  //     return 6379
  //   }
  // },
  smtp:{
    get host(){
      return 'smtp.qq.com'
    },
    get user(){
      return 'asdbd@qq.com'
    },
    get pass(){
      return 'asdjajdajkdjkk'
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
