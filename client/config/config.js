// https://umijs.org/config/
import CompressionWebpackPlugin from 'compression-webpack-plugin';
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  history: { type: 'browser' },
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : false,
  // umi routes: https://umijs.org/docs/routing
  routes,
  access: {},
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    // https://ant.design/docs/react/customize-theme-variable-cn
    'root-entry-name': 'variable',
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  // publicPath: './',
  manifest: {
    basePath: './',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  // openAPI: [
  //   {
  //     requestLibPath: "import { request } from 'umi'",
  //     // 或者使用在线的版本
  //     // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
  //     schemaPath: join(__dirname, 'oneapi.json'),
  //     mock: false,
  //   },
  //   {
  //     requestLibPath: "import { request } from 'umi'",
  //     schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
  //     projectName: 'swagger',
  //   },
  // ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {
    // plugins: ['@babel/plugin-proposal-decorators'],
  },
  exportStatic: {},
  // 引入被 external 库的 scripts
  // 区分 development 和 production，使用不同的产物
  // scripts:
  //   process.env.NODE_ENV === 'development'
  //     ? [
  //         'https://lib.baomitu.com/react/17.0.2/umd/react.development.js',
  //         'https://lib.baomitu.com/react-dom/17.0.2/umd/react-dom.development.js',
  //       ]
  //     : [
  //         'https://lib.baomitu.com/react/17.0.2/umd/react.production.min.js',
  //         'https://lib.baomitu.com/react-dom/17.0.2/umd/react-dom.production.min.js',
  //       ],
  chunks: ['common', 'vendor', 'umi'],
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.merge({
        optimization: {
          minimize: true,
          splitChunks: {
            // 表示选择哪些 chunks 进行分割，可选值有：async，initial和all
            chunks: 'all',
            // 表示新分离出的chunk必须大于等于minSize，默认为30000，约30kb。
            minSize: 30000,
            // 表示一个模块至少应被minChunks个chunk所包含才能分割。默认为1。
            minChunks: 2,
            // 表示按需加载文件时，并行请求的最大数目。默认为5。
            maxAsyncRequests: 10,
            // 表示加载入口文件时，并行请求的最大数目。默认为3。
            maxInitialRequests: 5,
            // 表示拆分出的chunk的名称连接符。默认为~。如chunk~vendors.js
            automaticNameDelimiter: '.',
            // 设置chunk的文件名。默认为true。当为true时，splitChunks基于chunk和cacheGroups的key自动命名。
            // name: true,
            cacheGroups: {
              common: {
                name: 'common',
                chunks: 'all',
                test: /(|react|react-dom|react-router|react-router-dom|dva|core-js|moment|[\/])/,
                priority: 12,
              },
              vendor: {
                name: 'vendor',
                chunks: 'all',
                test: /(@antv|@ant-design|antd|@ant-design\/icons|@ant-design\/pro-layout)/,
                priority: 13,
              },
            },
          },
        },
      });
      // 生产模式开启
      config.plugin('compression-webpack-plugin').use(
        new CompressionWebpackPlugin({
          // filename: 文件名称，这里我们不设置，让它保持和未压缩的文件同一个名称
          algorithm: 'gzip', // 指定生成gzip格式
          test: /\.js$|\.html$|\.css$/, // 匹配哪些格式文件需要压缩
          threshold: 10240, //对超过10k的数据进行压缩
          minRatio: 0.6, // 压缩比例，值为0 ~ 1
        }),
      );
    }
  },
});
