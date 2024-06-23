const path = require("path")
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

function getStyleLoader (pre) {
  return [
    // 'style-loader', // 将 css 代码注入到 style 标签中
    MiniCssExtractPlugin.loader, // 将 css 代码抽离到单独的 css 文件中
    'css-loader', // 将 css 文件转化成 commonjs 模块打包到 js 中
    // 使用 postcss-loader 自动添加浏览器前缀，解决浏览器兼容问题
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env" // 自动添加浏览器前缀
          ]
        }
      }
    },
    // 使用对于 less/sass 的 loader，将 Less/Sass 编译成 CSS
    pre
  ].filter(Boolean) // 过滤掉空值
}

module.exports = {
  // 入口
  entry: './src/main.js',
  // 出口
  output: {
    // 输出路径为当前项目根目录下的 dist 文件夹
    // 开发环境下，webpack 会将打包后的文件输出到内存中，不会生成实际的文件，所以这里设置为 undefined
    path: undefined,
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
        use: getStyleLoader()
      },
      {
        test: /\.less$/i,
        use: getStyleLoader('less-loader')
      },
      {
        test: /\.s[ac]ss$/i,
        use: getStyleLoader('sass-loader')
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
    // __dirname 是当前文件的绝对路径，这里使用 resolve 解析到 src 目录时需要 ../
    new ESLintPlugin({ context: path.resolve(__dirname, '../src') }),
    // 自动生成 index.html 文件，并自动引入打包后的 js 文件，并将 css 文件内联到 head 标签中
    // 这里使用 resolve 解析到 public 目录时需要 ../
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'), // 指定模板文件路径
    }),
    // 用于将 css 代码抽离到单独的 css 文件中
    new MiniCssExtractPlugin({
      filename: 'static/css/main.css' // 设置输出文件名
    }), 
    // 压缩 css 文件
    new CssMinimizerPlugin(),
  ],
  // 模式
  mode: 'development',
  // 开发服务器配置，开启后没有 dist 文件夹，而是实时编译打包
  devServer: {
    host: 'localhost',
    port: 3000,
    open: true, // 自动打开浏览器
    hot: true, // 开启热更新
  }
}