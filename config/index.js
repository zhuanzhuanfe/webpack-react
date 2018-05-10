'use strict'

const path = require('path')
const mixin = require('assign-deep')
const resolve = global._WEBPACK_RESOLVE

module.exports = (config) => {
  let cfg = {
    base: mixin({
      entry:{
        vendor:['react', 'react-dom'],
        app: resolve('src/app')
      },
      externals: {}, // 排除部分第三方组件不打包
      cssExtract:false,
      cssModule: false // css module自动关闭，部分组件库使用此功能会加载不了样式，例如antd
    }, config.base || {}),
    dev: mixin({
      https: false,
      // Paths
      assetsSubDirectory: 'static',
      assetsPublicPath:  '',
      proxyTable: {},
      host: 'localhost', 
      port: 8080, 
      autoOpenBrowser: false,
      errorOverlay: true,
      notifyOnErrors: true,
      poll: false, 
      useEslint: true,
      showEslintErrorsInOverlay: false,
      devtool: 'eval-source-map',
      cacheBusting: true,
      cssSourceMap: false,
      vconsole: false
    },config.dev || {}),
    build: mixin({
      web: 'webserver',
      // Paths
      assetsRoot: resolve('dist'),
      assetsSubDirectory: 'static',
      assetsPublicPath: `https://${config.build.staticCdn || config.dev.host + ':' + config.dev.port}`,
      // productionSourceMap: true,
      cssSourceMap: false,
      jsSourceMap: true,
      devtool: '#source-map',
      productionGzip: false,
      productionGzipExtensions: ['js', 'css'],
      bundleAnalyzerReport: false,
      imagemin: true,
      // 是否内嵌css和manifest文件
      inline:['app.css', 'manifest.js'],
      performance: true
    }, config.build || {})
  }

  if(process.env.npm_config_report) {
    cfg.build.bundleAnalyzerReport = true
  }

  return cfg
}
