import {
  Dep,
  effectWatch,
  reactive
} from '../../core/reactivity.js'

/* part 1 */
console.log('--------  part 1 ----------');
const a = new Dep(10);
let b = 0;

effectWatch(() => {
  b = a.value + 10;
  console.log(b);
})
a.value = 20;


/* part 2 */
console.log('--------  part 2 ----------');
const user = reactive({
  age: 10,
});
let nextAge = 0;
effectWatch(() => {
  nextAge = user.age + 1;
  console.log(nextAge);
})
user.age++;