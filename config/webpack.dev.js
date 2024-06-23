const path = require("path")
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin')
const os = require('os')

const threads = os.cpus().length // 获取 CPU 核心数

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
        // 使用 oneOf 匹配不同文件类型，一个文件只会使用第一个匹配成功的 loader，而不是全部去尝试一边
        oneOf: [
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
            use: [
              // 使用 thread-loader 开启多线程编译，加快打包速度
              {
                loader: 'thread-loader',
                options: {
                  workers: threads // 指定线程数，默认是 CPU 核心数
                }
              },
              {
                loader: 'babel-loader',
                // 不建议在这里配置，而是使用 .babelrc 配置文件统一配置
                options: {
                  // presets: ['@babel/preset-env'],
                  // 开启缓存后，babel-loader 会将缓存文件放到 node_modules/.cache/babel-loader/ 目录下，下次编译时会优先读取缓存文件，加快打包速度
                  // 缓存文件会在每次编译前检查是否有缓存，如果有缓存，则直接读取缓存文件，否则重新编译，并将编译后的文件缓存到缓存文件中
                  // 缓存文件会根据文件内容的哈希值生成，如果文件内容有变化，则哈希值也会变化，缓存文件也会重新生成
                  cacheDirectory: true,
                  cacheCompression: false, // 缓存压缩，默认 false，缓存文件不会被压缩，可以加快读取速度，但是会增加文件体积
                },
              },
            ]
          },
        ]
      }
    ]
  },
  // 插件
  plugins: [
    // 开启 eslint 校验，检查 src 目录下的文件
    // __dirname 是当前文件的绝对路径，这里使用 resolve 解析到 src 目录时需要 ../
    new ESLintPlugin({ 
      context: path.resolve(__dirname, '../src'),
      exclude: ['node_modules', 'bower_components'], // 排除 node_modules 和 bower_components 目录
      cache: true, // 开启缓存，加快 eslint 校验速度
      cacheLocation: path.resolve(__dirname, '../node_modules/.cache/eslint'), // 缓存文件路径
      threads: threads // 开启多线程，指定线程数，默认是 CPU 核心数
    }),
    // 自动生成 index.html 文件，并自动引入打包后的 js 文件，并将 css 文件内联到 head 标签中
    // 这里使用 resolve 解析到 public 目录时需要 ../
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'), // 指定模板文件路径
    }),
    // 用于将 css 代码抽离到单独的 css 文件中
    new MiniCssExtractPlugin({
      filename: 'static/css/main.css' // 设置输出文件名
    }), 
  ],
  // 优化项
  optimization: {
    // 压缩 js 文件
    minimize: true,
    minimizer: [
      // 压缩 css 文件
      new CssMinimizerPlugin(),
      // 压缩 js 文件
      new TerserWebpackPlugin({
        parallel: true, // 开启多线程压缩，加快压缩速度
      }),
    ]
  },
  // 模式
  mode: 'development',
  // 开启 source-map，方便调试，使用 cheap-module-source-map 优化打包速度，只进行行映射
  devtool: "cheap-module-source-map",
  // 开发服务器配置，开启后没有 dist 文件夹，而是实时编译打包
  devServer: {
    host: 'localhost',
    port: 3000,
    open: true, // 自动打开浏览器
    hot: true, // 开启热更新
  }
}