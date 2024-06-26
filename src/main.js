import count from "./js/count"
import sum from "./js/sum"
import './css/index.css'
import './css/iconfont.css'
import './less/index.less'
import './scss/index.scss'
import path from "path"

console.log(path.resolve(__dirname, '../', undefined || 'config'))

console.log(count(2, 1))
console.log(sum(1, 2, 3, 4))

// 测试 Eslint 规则
// var a = 10 // 配置文件中，不允许使用 var 声明变量
let a = 10
console.log(a)

// 判断是否支持 HotModuleReplacement（HMR、热模块替换）功能
if (module.hot) {
  module.hot.accept('./js/sum.js') // 监听文件变化，并自动重新加载模块，只会更新发生指定变化的模块
}

// 注册 ServiceWorker，使其可以离线缓存
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration)
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError)
    })
  })
}

// 使用 cross-env 跨平台设置环境变量
const env = process.env.NODE_ENV
console.log(env)