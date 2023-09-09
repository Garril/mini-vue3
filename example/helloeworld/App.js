import { h } from '../../lib/guide-mini-vue.esm.js';

export const App = {
  render() {
    return h('div', {
      id: "root",
      class: ["red", "bolder"]
    },
      // `hello, mini-vue,${this.msg}`
      [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "mini-vue")]);
  },
  setup() {
    return {
      msg: 'i am garril'
    };
  }
};
