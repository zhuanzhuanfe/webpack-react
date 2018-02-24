let merge = require('webpack-merge')
let webpack = require('./index')
module.exports = webpack.then(res => {
  // 自定义dev配置
  let dev = {
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin()
    ]
  }
  // 与默认配置合并
  res.devWebpackConfig = merge(res.prodWebpackConfig, dev);

  // 或者直接修改配置
  res.devWebpackConfig.devtool = false;
  res.dev()
})