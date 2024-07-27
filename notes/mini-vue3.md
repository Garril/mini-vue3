# mini-vue3

<hr/>

## vue结构

![image-20230329225431592](https://forupload.oss-cn-guangzhou.aliyuncs.com/newImg/image-20230329225431592.png)



### 处理编译

`@vue/comiler-sfc`解析`.vue`文件

`@vue/compiler-dom 底层依赖了 @vue/compiler-core`，这两个去处理`template`，把它编译为`render`函数



### 运行时

`@vue/runtime-dom`专门处理`dom`节点上的东西，`底层依赖了 @vue/runtime-core` 核心运行时

` @vue/runtime-core` 这也是包含了几乎所有的逻辑，重点！

` @vue/reactivity` 实现vue的响应式

上面的库都可以单独拿出来用。



### 单独使用库

首先举个例子：如何编译vue到js文件？

先借助rollup的打包功能，以及vue官方提供的插件`vue`

```js
// rollup.config.js
import vue from 'rollup-plugin-vue';
export default {
  input: './App.vue',
  plugins: [vue()],
  output: {
    name: "vue",
    format: "es",
    file: "lib/mini-vue.esm.js",
  },
};
```

这个官方提供的插件就可以帮我们把，sfc编译成js文件

其实就是利用了上面说到的`@vue/compiler-sfc`

#### 例子

```css
npm init -y
npm i @vue/reactivity
```

然后，创建`index.html 和main.js，其中 index.html 导入了 main.js type=module`

在`main.js`中

```js
import {
  ref,
  effect
} from './node_modules/@vue/reactivity/dist/reactivity.esm-browser.js' // 因为是跑在浏览器上的

const a = ref(10);
let b = 0;

effect(() => {
  b = a.value + 10;
  console.log(b);
})
a.value = 20;
```

看到打印`20 和 30`，执行顺序，逻辑什么的，略



## jest

```css
yarn add typescript --dev
npx tsc --init
生成tsconfig.json

yarn add jest @types/jest --dev
tsconfig.json加入
  "types":["jest"]
```

解决es6->es5

```css
https://jestjs.io/docs/getting-started

yarn add --dev babel-jest @babel/core @babel/preset-env
yarn add --dev @babel/preset-typescript
```

配置babel.config.js

```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
  ],
};
```

配置不生效，就改名：babel.config.cjs



## rollup

```js
yarn add rollup --dev
yarn add @rollup/plugin-typescript --dev
// 这个看情况 yarn add tslib --dev
// "build": "rollup -c rollup.config.js"
// 执行 yarn build时,src/index.ts/
export * from './runtime-core';
// 报错[!] RollupError: Could not resolve "./runtime-core" from "src/index.ts"
// tsconfig.json配置了"moduleResolution": "node" ，但是还是报错,则如下：
yarn add @rollup/plugin-node-resolve --dev
// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve'
plugins: [
    nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts'],
    }),
],
// 引入json问题 --- does nothing!
yarn add @rollup/plugin-json --dev
import json from '@rollup/plugin-json';
plugins: [
  json()
]
import pkg from './package.json' assert { type: "json" }; // it works
// right way to get pkg info
import { readFileSync } from 'fs';
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
```

```js
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
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    })
  ]
}
```

```js
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: './src/index.ts', // entry file
  output: [
    {
      format: 'cjs', //output format: amd es6 iife umd cjs
      file: 'lib/guide-mini-vue.cjs.js' // package files path
    },
    {
      format: 'es', //output format: amd es6 iife umd cjs
      file: 'lib/guide-mini-vue.esm.js' // package files path
    }
  ],
  plugins: [
    // we need parse typescript
    typescript(),
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.ts']
    })
  ]
};

```



