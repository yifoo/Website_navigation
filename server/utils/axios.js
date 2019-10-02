import axios from 'axios'

const instance = axios.create({
  baseURL:`http://${process.env.HOST||'localhost'}:${process.env.PORT||3005}`,
  timeout:5000,
  // headers:{
  //   'Content-Type': 'application/json;charset=UTF-8'
  // }
})

export default instance
