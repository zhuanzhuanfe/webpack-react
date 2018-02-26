# zz-webpack-react
> react版`webpack`打包工具，主要提供公共`webpack`配置，快速接入最新最优`webpack`配置

## 前言

* 目录结构及webpack配置修改遵循vue-cli生成模版的用法
* 兼容 ejs 模版语法
* 兼容单页面及多页面应用，简单的目录结构如下：
````file
// 多页面应用
my-project
  |__ src
  |    |__ pages // 存放页面入口，用于多页面应用中
  |    |     |__ detail.jsx // 例如，详情页
  |    |     |__ order.jsx  // 例如，订单页
  |    |__ app.jsx // 入口文件
  |__ template  // 存放模版文件
  |    |__ common // 公共模版
  |    |__ detail.ejs  //详情页模版文件
  |    |__ order.ejs  //订单页模版文件

// 单页面应用
my-project
  |__ src
  |    |__ app.jsx // 入口文件
  |__ template  // 存放模版文件
  |    |__ common // 公共模版
  |    |__ index.ejs  // 项目模版
````

## 使用步骤
### 安装
````bash
$ npm i -D zz-webpack-react
# 或
$ yarn add zz-webpack-react
````
### 初始化-已有项目
在当前目录中生成配置文件

````bash
$ node_modules/zz-webpack-react/bin/start
````

#### 执行命令
````bash
# dev命令，依赖全局的 webpack及webpack-dev-server工具
$ webpack-dev-server --inline --progress --disable-host-check --public --config webpack-react/build/dev.js

# build命令, 环境变量设置为：NODE_ENV=production，推荐使用cross-env，可以兼容mac和windows
$ node webpack-react/build/build.js
$ cross-env NODE_ENV=production node webpack-react/build/build.js
````
### 初始化-新项目
在当前目录中生成新项目模版
````bash
$ node_modules/zz-webpack-react/bin/init
````
demo目录结构如下：

```file
my-project
  |__ build         // webpack使用
  |     |__  build.js   // npm run build 执行文件
  |     |__  index.js   // 公共配置文件
  |     |__  dev.js     // npm run dev 执行文件
  |__ config        // webpack及离线包的配置文件
  |     |__  index.js   // webpack配置文件
  |__ src           // 项目逻辑代码
  |     |__  assets     // 静态资源，例如图片，公共样式
  |     |__  components // 组件及页面
  |     |__  lib        // 第三方库
  |     |__  router     // 路由文件夹，当使用路由功能时，相关代码放在router文件夹中
  |     |__  store      // 当使用 redux 时，相关代码放在store文件夹中    
  |     |__  pages      // 多页面应用是存放页面，配合文件名必须与template中模版名称一致
  |     |__  app.jsx     // 入口文件
  |__ template      // 模版文件目录
  |     |__  common // 公共模版
  |     |__  index.ejs // 模版文件
  |__ .babelrc      // babel配置文件
  |__ .editorconfig // 编辑器格式化配置文件
  |__ .eslintrc.js  // eslint 配置文件
  |__ .gitignore    // 忽略上传gitlab的文件
  |__ .postcss.js   // postcss配置
  |__ package.json  // 项目配置文件
  |__ README.md     // 项目说明使用文档
```
#### 执行命令

````bash
# 开发
$ npm run dev
# 打包
$ npm run build
````
## webpack动态修改

主要是执行webpack功能及动态修改webpack配置

### 开发配置文件

例如，config/index.js

```javascript
let path = require('path')
module.exports = {
   // 基础配置
    base:{
      // 入口文件配置
      entry:{
        vendor:['react', 'react-dom'],
        app: './src/app.jsx'
      },
      cssExtract: false // 提取css为单独的css文件，或者跟随chunk代码自动嵌入 <head>中，默认false，跟随chunk
    },
    // 开发模式配置
    dev:{
      https: false, // https功能，默认关闭, true/false
      host: 'localhost', // 本地启动地址
      port: 8080, // 启动端口号
      assetsPublicPath: '/Mzhuanzhuan/my-project/', // 访问虚拟路径，例如 http://localhost/Mzhuanzhuan/my-project/index.html
      proxyTable: {}, // 代理
      autoOpenBrowser: true, // 启动时自动打开浏览器，默认开启，true/false
      useEslint: true , // 开启eslint验证，配置模版时选择开启或关闭，true/false
      vconsole: false // 开启调试模式，默认关闭，true/false
    },
    // 构建模式配置
    build:{
      staticCdn: 'img.static.com.cn', // 静态资源域名
      bundleAnalyzerReport: false, // 开启代码分析报告功能，true/false，也可使用命令 npm run build --report
      productionSourceMap: true,   // 开启生成sourcemap功能，true/false
      index: path.resolve(__dirname, '../dist/webserver/index.html'), // 生成的index.html文件存放目录
      assetsRoot: path.resolve(__dirname, '../dist'), // 打包生成的文件存放目录
      imagemin: true, // 开启图片压缩， true/false
      inline:['app.css', 'manifest.js'], // 自定义内联静态资源
      performance: true // 性能限制，首次加载js+css不能超过400k, 单个文件大小不超过: 300k
    }
}
```

### 引入webpack插件
路径：`build/index.js`

````javascript
// 引入 webpack 打包工具
let webpackVue = require('webpack-react')
// webpack公共配置
let config = require('../config/index.js')
module.exports = webpackVue(config).then(res => {
  // 动态修改基础配置
  // 可重写公共webpack配置文件, 例如
  res.baseWebpackConfig.entry = {
    // 自定义重写
    vendor:['react', 'react-dom'],
    app:'./src/app.js'
  }
  // 也可使用 webpack-merge 进行配置合并
  return res
})
````
### dev模式
路径：`build/dev.js`

执行命令：（命令需要自行配置）
```bash
$ npm run dev
```

代码：
````javascript
// 执行 npm run dev
let webpack = require('./index')
module.exports = webpack.then(res => {
  // 自定义build配置
    let dev = {
      plugins: [
        new webpack.optimize.ModuleConcatenationPlugin()
      ]
    }
    // 与默认配置合并
    res.devWebpackConfig = merge(res.prodWebpackConfig, dev)
    // 可动态修改开发环境webpack配置，例如
    res.devWebpackConfig.devtool = false
    // 也可使用 webpack-merge 进行配置合并
    return res.dev()
})
````
### build模式
路径：`build/build.js`

执行命令：（命令需要自行配置）
```bash
# 构建项目
$ npm run build
```

代码：
```javascript
// 执行 npm run build
let merge = require('webpack-merge')
let webpack = require('./index')
module.exports = webpack.then(res => {
  // 自定义build配置
    let build = {
      plugins: [
        new webpack.optimize.ModuleConcatenationPlugin()
      ]
    }
    // 与默认配置合并
    res.prodWebpackConfig = merge(res.prodWebpackConfig, build)
  res.build()
})
```

