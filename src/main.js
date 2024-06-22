import count from "./js/count"
import sum from "./js/sum"
import './css/index.css'
import './css/iconfont.css'
import './less/index.less'
import './scss/index.scss'

console.log(count(2, 1))
console.log(sum(1, 2, 3, 4))

// 测试 Eslint 规则
// var a = 10 // 配置文件中，不允许使用 var 声明变量
let a = 10
console.log(a)