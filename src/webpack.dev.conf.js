'use strict'
const config = global._WEBPACK_CONFIG
const fs = require('fs');
const exists = fs.existsSync
const utils = require('./utils')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const vConsolePlugin = require('vconsole-webpack-plugin')
const resolve = global._WEBPACK_RESOLVE
const entries = utils.getEntry([resolve('src/pages/**/*.jsx')]); // 获得多页面的入口js文件
const pages = utils.getEntry([resolve('template/**/*.{ejs, html, htm}')]);

let webpackDevConfig = {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true,
      extract: config.base.cssExtract || false
    })
  },
  devtool: config.dev.devtool,
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: process.env.HOST ||  config.dev.host,
    https: config.dev.https,
    port: process.env.PORT ||  config.dev.port,
    open: config.dev.autoOpenBrowser,
    openPage: config.dev.assetsPublicPath.replace(/^\//, ''),
    overlay: config.dev.errorOverlay ? {
      warnings: false,
      errors: true,
    } : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      allChunks: false,
    }),
    new vConsolePlugin({
      enable: config.dev.vconsole // 发布代码前记得改回 false
    })
  ]
}

const htmlConf = (page = '', pathname = 'app') => {
  const conf = {
    filename: `${pathname === 'app' ? 'index' : pathname}.html`,
    template: page || (exists(resolve('index.ejs')) ? resolve('index.ejs') : resolve('index.html')), // 模板路径
    inject: true, // js插入位置
    chunksSortMode: 'dependency',
    chunks: ['vendor', pathname]
  };
  return conf;
}
let mutiPage = false;
const entriesKeys = Object.keys(entries);
Object.keys(pages).every(v => {
  if(entriesKeys.indexOf(v) >= 0) {
    mutiPage = true;
    return false;
  }
  return true;
})
if(entries && entriesKeys.length && mutiPage) {
    for (let [pathname, page] of utils.entries(pages)) {
      if (exists(resolve(`src/pages/${pathname}.jsx`))) {
        webpackDevConfig.plugins.push(new HtmlWebpackPlugin(htmlConf(page, pathname)));
      }
    }
} else {
  webpackDevConfig.plugins.push(new HtmlWebpackPlugin(htmlConf(pages['index'])));
}

module.exports = webpackDevConfig;
