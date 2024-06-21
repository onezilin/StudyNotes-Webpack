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
      {
        test: /\.css$/i, // 匹配 css 文件
        // 使用 style-loader 和 css-loader 加载 css 文件，执行顺序从后往前
        use: [
          'style-loader', // 将 css 代码注入到 style 标签中
          'css-loader' // 将 css 文件转化成 commonjs 模块打包到 js 中
        ], 
      },
      {
        test: /\.less$/i,
        use: [
            'style-loader',
            'css-loader',
            // 将 Less 编译成 CSS
            'less-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
            'style-loader',
            'css-loader',
            // 将 Sass 编译成 CSS
            'sass-loader',
        ],
      },
    ]
  },
  // 插件
  plugins: [
  ],
  // 模式
  mode: 'development'
}