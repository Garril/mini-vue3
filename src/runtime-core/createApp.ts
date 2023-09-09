import { render } from "./renderer";
import { createVNode } from "./vnode";

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // transform to vnode
      const vnode = createVNode(rootComponent);
      render(vnode,rootContainer);
    }
  }
}
