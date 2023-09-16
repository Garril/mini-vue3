import { PublicInstanceProxyHanlders } from "./componentPublicInstance";

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {}
  };
  return component;
}
export function setupComponent(instance) {
  /*
    instance is an object: 
    { vnode: { type,props,children} and type is object exported by App.js,
      type: vnode.type 
    }
  */
  // initProps()
  // initSlots()
  setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
  const component = instance.type;

  // create proxy for "this" in template
  instance.proxy = new Proxy(
    {_: instance},
    PublicInstanceProxyHanlders
  );

  const { setup } = component;
  if (setup) {
    const setupResult: Function | Object = setup();
    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance, setupResult: Function | Object) {
  if (typeof setupResult == 'object') {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const component = instance.type;
  if (component.render) {
    instance.render = component.render;
  }
}
