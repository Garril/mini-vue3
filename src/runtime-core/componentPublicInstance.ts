export const PublicInstanceProxyHanlders = {
  get({ _: instance }, key) {
    // setupState
    const { setupState } = instance;
    if (key in setupState) {
      return setupState[key];
    }
    // $el -> the root dom element
    if (key == '$el') {
      return instance.vnode.el;
    }
    // $data
    // $props
    // $options
    // $parent
    // $root
    // $slots
    // $refs
    // $attrs
  }
};
