import { h } from '../../lib/guide-mini-vue.esm.js';

export const Foo = {
  // 1.setup can get props.
  // 2.template can get props by this.props.
  // 3.props is shallow readonly.
  setup(props) {
    props.count++;
    console.log(props);
  },
  render() {
    return h("div", {}, "foo: " + this.count);
  }
}