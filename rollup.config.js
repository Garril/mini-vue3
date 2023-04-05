import { babel } from '@rollup/plugin-babel'

export default {
  input: './test/framework/main.js', //入口文件
  output: {
    file: './test/dist/bundle.js', //打包后的存放文件
    format: 'cjs', //输出格式 amd es6 iife umd cjs
    name: 'bundleName', //如果iife,umd需要指定一个全局变量
    sourcemap: true //生成bundle.map.js文件，方便调试
  },
  plugins: [
    babel({
      babelHelpers:'bundled',
      exclude: 'node_modules/**'
    })
  ]
}
