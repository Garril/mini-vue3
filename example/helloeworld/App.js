import { h } from '../../lib/guide-mini-vue.esm.js';

export const App = {
  render() {
    return h("div", `hello, mini-vue.${this.msg}`);
  },
  setup() {
    return {
      msg: "i am garril",
    }
  }
}