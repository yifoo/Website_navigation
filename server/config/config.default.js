/* eslint valid-jsdoc: "off" */

'use strict'
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1579272880581_3079'
  // add your middleware config here
  config.middleware = []
  config.siteFile = {
    '/favicon.ico': 'https://www.haohome.top/favicon.ico'
  }
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }
  // mysql配置文件
  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: '127.0.0.1',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: 'root',
      // 数据库名
      database: 'nav_test',
      multipleStatements: true
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false
  }
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    // 下面这条加上才能共享跨域session，同时前端ajax请求也要加上响应的参数
    credentials: true
  }
  config.cluster = {
    listen: {
      port: 7000
    }
  }
  config.security = {
    // 关闭csrf验证
    csrf: {
      enable: false
    },
    // 白名单
    domainWhiteList: ['*']
  }
  const whitelist = [
    // images
    '.jpg',
    '.jpeg', // image/jpeg
    '.png', // image/png, image/x-png
    '.gif', // image/gif
    '.bmp', // image/bmp
    '.wbmp', // image/vnd.wap.wbmp
    '.webp',
    '.tif',
    '.psd',
    // text
    '.svg',
    '.xlsx',
    '.js',
    '.jsx',
    '.json',
    '.css',
    '.less',
    '.html',
    '.htm',
    '.xml',
    // tar
    '.zip',
    '.gz',
    '.tgz',
    '.gzip',
    // video
    '.mp3',
    '.mp4',
    '.avi'
  ]
  config.multipart = {
    mode: 'stream',
    autoFields: false,
    defaultCharset: 'utf8',
    fileExtensions: whitelist,
    whitelist: null
  }
  // config.alinode = {
  //   // 从 `Node.js 性能平台` 获取对应的接入参数
  //   appid: '83670',
  //   secret: '8a7466d106abdd570b37afe865cd40648065bab9',
  // };
  config.logger = {
    dir: '../logs',
    level: 'NONE',
    consoleLevel: 'NONE'
  }
  config.jwt = {
    secret: '123456' //自定义token的加密条件字符串，可按各自的需求填写
    // sign: { expiresIn: 2592000 }
  }
  console.log('运行环境', appInfo.env)
  return {
    ...config,
    ...userConfig
  }
}
