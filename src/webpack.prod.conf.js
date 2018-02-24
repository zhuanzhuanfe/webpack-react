'use strict'
const fs = require('fs');
const exists = fs.existsSync
const os = require('os')
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = global._WEBPACK_CONFIG
const resolve = global._WEBPACK_RESOLVE
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const pages = utils.getEntry([resolve('template/**/*.{ejs, html, htm}')]);

const env =  require('../config/prod.env')
const webpackConfig = {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: config.base.cssExtract || false,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
  },
  plugins: [
    new CleanWebpackPlugin('dist', {
      root:resolve(),
      verbose: true,
      dry: false,           
      watch: true
    }),
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // UglifyJs do not support ES6+, you can also use babel-minify for better treeshaking: https://github.com/babel/minify
    new webpack.optimize.UglifyJsPlugin({
      parallel: {
        cache: true,
        workers: os.cpus().length
      },
      // 最紧凑的输出
      beautify: false,
      // 删除所有的注释
      comments: false,
      compress: {
        // 在UglifyJs删除没有用到的代码时不输出警告 
        warnings: false,
        // 删除所有的 `console` 语句
        // drop_console: false,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true,
      },
      sourceMap: config.build.productionSourceMap
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh|en/),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // set the following option to `true` if you want to extract CSS from
      // codesplit chunks into this main css file as well.
      // This will result in *all* of your app's CSS being loaded upfront.
      allChunks: false,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
      ? { safe: true, map: { inline: false } }
      : { safe: true }
    }),
    
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: resolve('static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
}

const inline = config.build.inline
let regRxpArr = []
let inlineRegExp = null
if(inline) {
  for(let [k, v] of utils.entries(inline)) {
    let patharr = v.split('.')
    regRxpArr.push(`(${patharr[0]})\.(.+)?\.${patharr[patharr.length - 1]}`)
  }
  if(regRxpArr.length) {
    inlineRegExp = new RegExp(`${regRxpArr.join('|')}$`)
  }
  // console.log(inlineRegExp);
}

const htmlConf = (page = '', pathname = 'app') => {
  const conf = {
    filename: `${config.build.web}/${pathname === 'app' ? 'index' : pathname}.html`,
    template: page || (exists(resolve('index.ejs')) ? resolve('index.ejs') : resolve('index.html')), // 模板路径
    inject: true, // js插入位置
    chunksSortMode: 'dependency',
    chunks: ['manifest', 'vendor', pathname],
    hash: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    }
  };

  if(inlineRegExp) conf.inlineSource = inlineRegExp;
  // console.log(conf);
  return conf;
}
const listKeys = Object.keys(pages);
const listPages = Object.values(pages);
if(listKeys.length) {
  if(listKeys.length === 1 && !exists(resolve(`src/pages/${listKeys[0]}.jsx`))) {
    webpackConfig.plugins.push(new HtmlWebpackPlugin(htmlConf(listPages[0])));
  } else {
    for (let [pathname, page] of utils.entries(pages)) {
      if (exists(resolve(`src/pages/${pathname}.jsx`))) {
        webpackConfig.plugins.push(new HtmlWebpackPlugin(htmlConf(page, pathname)));
      }
    }
  }
} else {
  webpackConfig.plugins.push(new HtmlWebpackPlugin(htmlConf()));
}
// 内联资源
webpackConfig.plugins.push(new HtmlWebpackInlineSourcePlugin());

// js处理
webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
  name: ['manifest', 'vendor'].reverse(),
  minChunks:Infinity
}));

// chunk公共样式提取
// console.log(pages);
webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
  name: Object.keys(pages).length ? Object.keys(pages) : 'app',
  // filename:'[name].bundle.js',
  async: 'vendor-async',
  children: true,
  minChunks: 2
}));

// 性能埋点
// webpackConfig.plugins.push(new PerfWebpackPlugin());

// 开启性能限制
if(config.build.performance) {
  webpackConfig.performance = {
    hints: 'error',
    maxEntrypointSize: 400000,
    maxAssetSize: 300000
  }
}

// 开启图片压缩
if (config.build.imagemin) {
  const ImageminPlugin = require('imagemin-webpack-plugin').default
  webpackConfig.plugins.push(
    new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i })
  )
}

// 开启badjs异常上报
if(config.build.badjs && config.build.badjs > 0) {
  const BadjsWebpackPlugin = require('@zz-yy/badjs-webpack-plugin')
  // TODO 监控erro 上线打开，测试注释掉
  webpackConfig.plugins.push(new BadjsWebpackPlugin({id: config.build.badjs}))
  webpackConfig.output.crossOriginLoading = 'anonymous'
}

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin({
    analyzerPort: Math.floor(Math.random()*999)+8000
  }))
}

module.exports = webpackConfig;
