import { createApp, effectWatch } from '../../core';
export default {
  // template -> render
  render(context) {
    effectWatch(() => {
      const element = document.createElement("div");
      const text1 = document.createTextNode("i am text1");
      const text2 = document.createTextNode(context.obj.count);
      element.append(text1);
      element.append(text2);
      return element;
    });
  },
  setup() {
    const obj = reactive({
      count: 1,
    });
    window.obj = obj;
    return {
      obj,
    };
  },
};
