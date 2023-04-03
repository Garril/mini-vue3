import {
  ref,
  effect
} from '@vue/reactivity/dist/reactivity.esm-browser.js' // 因为是跑在浏览器上的

const a = ref(10);
let b = 0;

effect(() => {
  b = a.value + 10;
  console.log(b);
})
a.value = 20;