import { hasOwn } from '../shared';

export const PublicInstanceProxyHanlders = {
  get({ _: instance }, key) {
    const { setupState, props } = instance;
    if (hasOwn(setupState, key)) {
      // setupState
      return setupState[key];
    } else if (hasOwn(props, key)) {
      // $props
      return props[key];
    }
    // $el -> the root dom element
    if (key == '$el') {
      return instance.vnode.el;
    }
    // $data
    // $options
    // $parent
    // $root
    // $slots
    // $refs
    // $attrs
  }
};
