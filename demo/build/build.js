let webpack = require('./index')

module.exports = webpack.then(res => {
  res.build()
})