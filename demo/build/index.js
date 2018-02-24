// 引入 webpack 打包工具
let webpackVue = require('webpack-react')
// webpack公共配置
let config = require('../config/index.js')
module.exports = webpackVue(config).then(res => {
  return res
})