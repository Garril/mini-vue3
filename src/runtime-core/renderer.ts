import { isObject } from '../shared';
import { createComponentInstance, setupComponent } from './component';

export function render(vnode, container) {
  // patch
  patch(vnode, container);
}
function patch(vnode, container) {
  console.log('vnode.type: ', vnode.type);
  // check type of vnode
  if (typeof vnode.type == 'string') {
    // processElement (type == element)
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    // processComponent (type == component)
    processComponent(vnode, container);
  }
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}

function mountComponent(vnode: any, container: any) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function mountElement(vnode: any, container: any) {
  const { type, props, children } = vnode;
  // create dom
  const el = document.createElement(type);
  // props
  for (const key in props) {
    const val = props[key];
    el.setAttribute(key, val);
  }
  // children
  if (typeof children == 'string') {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el);
  }
  // mount dom
  container.append(el);
}

function mountChildren(vnode, container) {
  vnode.children.forEach((vnode) => {
    patch(vnode, container);
  });
}

function setupRenderEffect(instance, container) {
  // get vnode
  const subTree = instance.render();
  // get element
  // mountElement
  patch(subTree, container);
}
