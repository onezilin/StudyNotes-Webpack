/*
 * @Author: wanzilin
 * @Date: 2024-06-22 17:52:20
 * @LastEditors: wanzilin
 * @LastEditTime: 2024-06-23 00:24:46
 * @FilePath: \StudyNotes-Webpack\config\webpack.prod.js
 */
const path = require("path")
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // 入口
  entry: './src/main.js',
  // 出口
  output: {
    // 输出路径为当前项目根目录下的 dist 文件夹
    path: path.resolve(__dirname, '../dist'),
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
          // 'style-loader', // 将 css 代码注入到 style 标签中
          MiniCssExtractPlugin.loader, // 将 css 代码提取到单独的 css 文件中
          'css-loader' // 将 css 文件转化成 commonjs 模块打包到 js 中
        ],
      },
      {
        test: /\.less$/i,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          // 将 Less 编译成 CSS
          'less-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
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
    new ESLintPlugin({ context: path.resolve(__dirname, '../src') }),
    // 自动生成 index.html 文件，并自动引入打包后的 js 文件，并将 css 文件内联到 head 标签中
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'), // 指定模板文件路径
    }),
    // 提取 css 文件到单独的 css 文件中
    new MiniCssExtractPlugin({
      filename: "static/css/main.css"
    })
  ],
  // 模式
  mode: 'production',
  // 开发服务器配置，开启后没有 dist 文件夹，而是实时编译打包
  // 生产模式下不需要 devServer
  // devServer: {
  //   host: 'localhost',
  //   port: 3000,
  //   open: true, // 自动打开浏览器
  //   hot: true, // 开启热更新
  // }
}