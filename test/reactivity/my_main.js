import {
  Dep,
  effectWatch
} from '../../core/reactivity.js'

const a = new Dep(10);
let b = 0;

effectWatch(() => {
  b = a.value + 10;
  console.log(b);
})
a.value = 20;