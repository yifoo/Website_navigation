import CompressionWebpackPlugin from 'compression-webpack-plugin';
import { defineConfig } from 'umi';
import routes from './src/config/routes';
console.log('env', process.env.NODE_ENV);
export default defineConfig({
  esbuild: {}, //替换压缩器为 esbuild
  dynamicImport: {}, //启用按需加载
  nodeModulesTransform: {
    type: 'none',
  },
  history: { type: 'hash' },
  // base:'./',
  favicon: './img/favicon.ico',
  devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : false,
  publicPath: './',
  title: '个人收藏夹',
  routes: routes,
  fastRefresh: {},
  dva: { hmr: true },
  plugins: [],
  mfsu: {},
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
                test: /(|react|react-dom|react-router|react-router-dom|dva|core-js|moment|[\\/])/,
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
  analyze: {
    analyzerMode: 'server',
    analyzerPort: 8888,
    openAnalyzer: true,
    // generate stats file while ANALYZE_DUMP exist
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info',
    defaultSizes: 'parsed', // stat  // gzip
  },
});
