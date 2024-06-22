const path = require("path")
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = {
  // 入口
  entry: './src/main.js',
  // 出口
  output: {
    // 输出路径为当前项目根目录下的 dist 文件夹
    path: path.resolve(__dirname, 'dist'),
    // 输出文件名为 main.js
    filename: 'static/js/main.js',
    // 每次打包前清空 path 目录
    clean: true
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
      // 将匹配的资源转化为 base64 编码，并内联到 js 文件中
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/i,
        type: 'asset', // 指定资源类型为 asset/inline，将资源内联到 js 文件中
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 小于 4kb 的图片才会转为 base64 编码
          }
        },
        // 设置图片的输出路径及名称
        generator: {
          filename: 'static/images/[hash:10][ext][query]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource', // 指定资源类型为 asset/resource，将资源复制到输出目录
        generator: {
          filename: 'static/fonts/[hash:10][ext][query]'
        }
      },
      // 引入 babel-loader 进行 js 转化
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/, // 排除 node_modules 和 bower_components 目录
        use: {
          loader: 'babel-loader',
          // 不建议在这里配置，而是使用 .babelrc 配置文件统一配置
          // options: {
          //   presets: ['@babel/preset-env'],
          // },
        },
      },
    ]
  },
  // 插件
  plugins: [
    // 开启 eslint 校验，检查 src 目录下的文件
    new ESLintPlugin({ context: path.resolve(__dirname, 'src') })
  ],
  // 模式
  mode: 'development'
}