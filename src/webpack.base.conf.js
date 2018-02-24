'use strict'
const path = require('path')
const mixin = require('assign-deep')
const config = global._WEBPACK_CONFIG
const resolve =  global._WEBPACK_RESOLVE
const utils = require('./utils')
const entries = utils.getEntry([resolve('src/pages/**/*.jsx')]); // 获得多页面的入口js文件
const pages = utils.getEntry([resolve('template/**/*.{ejs, html, htm}')]);

// const HappyPack = require('happypack')
// const os = require('os')
// const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
// console.log(mixin(config.base.entry, entries));
// console.log(entries);
if(pages['index'] && entries['index']) {
  delete config.base.entry['app'];
}
// console.log(mixin(config.base.entry, entries));
module.exports = {
    context:resolve(),
    entry: mixin(config.base.entry, entries),
    output: {
      path: config.build.assetsRoot,
      filename: '[name].js',
      publicPath: process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
    },
    resolve: {
      extensions: ['.jsx', '.js', '.json', '.scss'],
      alias: {
        '@models': resolve('build/models')
      }
    },
    module: {
      rules: [
        ...(config.dev.useEslint? [{
          test: /\.(js|jsx)$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          include: [resolve('src')],
          options: {
            formatter: require('eslint-friendly-formatter'),
            emitWarning: !config.dev.showEslintErrorsInOverlay
          }
        }] : []),
        
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          include: [resolve('src')]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 3000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.ejs$/, 
          loader: "ejs-compiled-loader"
        }
      ]
    },
    // plugins: [
    //   new HappyPack({
    //     id: 'happybabel',
    //     loaders: ['babel-loader'],
    //     threadPool: happyThreadPool,
    //     verbose: true,
    //     debug: false
    //   })
    // ]
  }
