import { shallowReadonly } from '../reactivity/reactive';
import { initProps } from './componentProps';
import { PublicInstanceProxyHanlders } from './componentPublicInstance';

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {}
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
  initProps(instance, instance.vnode.props);
  // initSlots()
  setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
  const component = instance.type;

  // create proxy for "this" in template
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHanlders);

  const { setup } = component;
  if (setup) {
    const setupResult: Function | Object = setup(
      shallowReadonly(instance.props)
    );
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
