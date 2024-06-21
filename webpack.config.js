const path = require("path")

module.exports = {
  // 入口
  entry: './src/main.js',
  // 出口
  output: {
    // 输出路径为当前项目根目录下的 dist 文件夹
    path: path.resolve(__dirname, 'dist'),
    // 输出文件名为 main.js
    filename: 'main.js'
  },
  // 加载器
  module: {
    rules: [
    ]
  },
  // 插件
  plugins: [
  ],
  // 模式
  mode: 'development'
}