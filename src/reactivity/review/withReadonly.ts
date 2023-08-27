// Based on withStop.ts, realize readonly.
// look at basic.ts --function createGetter
// section one
// reactive.ts (init enum)
const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}
// baseHandlers.ts (create setter and getter)
function createGetter(isReadonly: boolean = false) {
  return function get(target, key, receiver) {
    if (key == ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key == ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }
    const val = Reflect.get(target, key, receiver);
    if (!isReadonly) {
      // track(target,key);
    }
    return val;
  };
}
function createSetter() {
  return function set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver);
    // trigger(target, key);
    return res;
  };
}
// section two
// isReactive and isReadonly
// reactive.ts (how to use the function before in baseHandlers.ts)
const getter = createGetter(false);
const readonlyGetter = createGetter(true);
const setter = createSetter();
const mutableHandlers = {
  get: getter,
  set: setter
  // ...
};
const readOnlyHandlers = {
  get: readonlyGetter,
  // special dispose this set
  set(target, key, value) {
    console.warn(`key:${key} set failed.Because target is readonly`);
    return true;
  }
  // ...
};

function createActiveObject(raw: any, proxyHandler) {
  return new Proxy(raw, proxyHandler);
}
function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}
function readonly(raw) {
  return createActiveObject(raw, readOnlyHandlers);
}
function isReactive(obj) {
  return !!obj[ReactiveFlags.IS_REACTIVE];
}
function isReadonly(obj) {
  return !!obj[ReactiveFlags.IS_READONLY];
}
