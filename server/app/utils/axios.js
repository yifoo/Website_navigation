'use strict'
const axios = require('axios')
// create an axios instance
const service = axios.create({
  timeout: 60000 // request timeout
})
// request interceptor
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (res) => {
    // // if the custom code is not 200, it is judged as an error.
    // if (res.code !== 200) {
    //   return Promise.reject(new Error(res.message || 'Error'));
    // }
    return res
  },
  (error) => {
    console.log('err' + error) // for debug
    return { data: '' }
    // return Promise.reject(error)
  }
)

module.exports = service
