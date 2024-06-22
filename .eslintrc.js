module.exports = {
  // 解析选项
  parserOptions: {
    ecmaVersion: 6, // 指定 ECMAScript 版本
    sourceType: "module", // 使用 ESM 模块
  },
  // 具体规则
  rules: {
    "no-var": "error", // 不使用 var 声明变量
  },
  // 继承其他规则
  extends: [
    "eslint:recommended" // eslint 官方推荐规则
  ],
  env: {
    browser: true, // 启用 browser 中的全局变量
    node: true, // 启用 node 中的全局变量
  }
}  