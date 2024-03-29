import { h } from '../../lib/guide-mini-vue.esm.js';
import { Foo } from './Foo.js';

export const App = {
  name: 'App',
  render() {
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'bolder'],
        onClick() {
          console.log("click");
        },
        onMousedown() {
          console.log("mouseDown");
        }
      },
      // [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "mini-vue")];
      [h("div", {}, `hello, mini-vue,${this.msg}`), h(Foo, {
        count: 1
      })]
      /* the "this" in render actually is a proxy
        because the "this" includes "setupState、$el、$data" and so on
        we need make it more convenient for users,just use "this" to get all.
        Implementation ideas: create proxy when component created,bind this when render called.
      */
    );
  },
  setup() {
    return {
      msg: 'i am garril'
    };
  }
};
