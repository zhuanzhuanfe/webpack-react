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
      cssExtract:false
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
      productionSourceMap: true,
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
