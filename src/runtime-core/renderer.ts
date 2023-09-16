import { isObject, isOnEvent } from '../shared';
import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from './component';

export function render(vnode, container) {
  // patch
  patch(vnode, container);
}
function patch(vnode, container) {
  console.log('vnode.type: ', vnode.type);
  // check type of vnode
  const { shapeFlag } = vnode;
  if (shapeFlag & ShapeFlags.ELEMENT) {
    // processElement (type == element)
    processElement(vnode, container);
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
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

function mountComponent(initVnode: any, container: any) {
  /* instance may be: 
    const component = { 
      vnode: vnode --> { type,props,children }, 
      type: vnode.type --> { render,setup }
    };  */
  const instance = createComponentInstance(initVnode);
  /* instance attached lots of attributes by setupComponent
    such as: 
      setupState and render (it's just run the methods before) */
  setupComponent(instance);
  // get tree and patch
  setupRenderEffect(instance, initVnode, container);
}

function mountElement(vnode: any, container: any) {
  const { type, props, children, shapeFlag } = vnode;
  // create dom(element type vnode like: "div")
  const el = (vnode.el = document.createElement(type));
  // props
  for (const key in props) {
    const val = props[key];
    if (isOnEvent(key)) {
      // event listener
      const eventName = key.slice(2).toLowerCase();
      el.addEventListener(eventName, val);
    } else {
      el.setAttribute(key, val);
    }
  }
  // children
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
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

function setupRenderEffect(instance, initVnode, container) {
  const { proxy } = instance;
  // get vnode
  const subTree = instance.render.call(proxy);
  // mountElement
  patch(subTree, container);
  // after all the element mounted.
  // subTree is the root vnode,we can get el through it,attach it into component's vnode
  initVnode.el = subTree.el;
}
