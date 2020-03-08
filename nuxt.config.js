const pkg = require('./package')
module.exports = {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: "风行导航",
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: pkg.description
      }
    ],
    link: [{
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href: '//at.alicdn.com/t/font_767464_1h6p4uer6ir.css'
      },
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: false,

  /*
   ** Global CSS
   */
  css: [
    'element-ui/lib/theme-chalk/reset.css',
    'element-ui/lib/theme-chalk/index.css',
    '~assets/css/main.scss'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/utils',
    '@/plugins/axios',
    '@/plugins/vueLazyload',
    { src: '@/plugins/router', ssr: true }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios'
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.NODE_ENV === 'production' ? '请求地址' : 'http://localhost:3005'
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
        config.devtool = 'cheap-module-eval-source-map'
      }
      if (!ctx.isDev&& ctx.isClient) {
        config.plugins.push(new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              // warnings: false,
              drop_debugger: true,
              drop_console: true
            }
          },
          sourceMap: true,
          parallel: true
        }), )
        config.devtool = 'source-map'
      }
    }
  },
  cache: false
}
