import consola from 'consola'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import session from 'koa-generic-session'
import json from 'koa-json'
import logger from 'koa-logger'
// import Redis from 'koa-redis'
import Router from 'koa-router'
import cors from 'koa2-cors'
import { Builder, Nuxt } from 'nuxt'
import path from 'path'
import passport from './utils/passport'
import utils from './utils/utils'

utils.init()
const app = new Koa()
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3005

app.keys = ['haohome']
app.proxy = true
app.use(session({
  key: 'haohome_SESSIONID',
  prefix: 'haohome:uid',
  // store: new Redis()
}))
app.use(bodyParser({
  extendTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(cors({
  origin: function (ctx) {
    return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(passport.initialize())
app.use(passport.session())
// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }
  // *加载路由中间件
  const routerList = utils.mapDir(path.resolve('./server/controllers'))
  Object.keys(routerList).map(key => {
    if (routerList[key] instanceof Router) {
      app.use(routerList[key].routes()).use(routerList[key].allowedMethods())
    } else {
      Object.keys(routerList[key]).map(index => {
        app.use(routerList[key][index].routes()).use(routerList[key][index].allowedMethods())
      })
    }
  })
  app.use(ctx => {
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset
    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, promise => {
        promise.then(resolve).catch(reject)
      })
    })
  })
  app.listen(port, host)
  consola.ready({
    message: `服务器地址: http://${host}:${port}`,
    badge: true
  })
}

start()
