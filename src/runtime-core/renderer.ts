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
  /* instance may be: 
    const component = { 
      vnode: vnode --> { type,props,children }, 
      type: vnode.type --> { render,setup }
    };  */
  const instance = createComponentInstance(vnode);
  /* instance attached lots of attributes by setupComponent
    such as: 
      setupState and render (it's just run the methods before) */
  setupComponent(instance);
  // get tree and patch
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
  const { proxy } = instance;
  // get vnode
  const subTree = instance.render.call(proxy);
  // get element
  // mountElement
  patch(subTree, container);
}
