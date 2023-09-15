import { h } from '../../lib/guide-mini-vue.esm.js';

export const App = {
  render() {
    return h('div', {
      id: "root",
      class: ["red", "bolder"]
    },
      // [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "mini-vue")];
      `hello, mini-vue,${this.msg}`
      /* the "this" in render actually is a proxy
        because the "this" includes "setupState、$el、$data" and so on
        we need make it more convenient for users,just use "this" to get all.
        Implementation ideas: create proxy when component created,bind this when render called.
      */
    )
  },
  setup() {
    return {
      msg: 'i am garril'
    };
  }
};
