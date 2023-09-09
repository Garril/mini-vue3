import { createComponentInstance, setupComponent } from './component';

export function render(vnode, container) {
  // patch
  patch(vnode, container);
}
function patch(vnode, container) {
  // check type of vnode
  if (vnode.type == 'div') {
    // processElement (type == element)
    processElement(vnode, container);
  } else {
    // processComponent (type == component)
    processComponent(vnode, container);
  }
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}
function processElement(vnode: any, container: any) {}

function mountComponent(vnode: any, container: any) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance);
  setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
  // get vnode
  const subTree = instance.render();
  // get element
  // mountElement
  patch(subTree, container);
}
