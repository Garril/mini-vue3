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





