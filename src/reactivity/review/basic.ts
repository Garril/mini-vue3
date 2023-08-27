// review code
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
// reactive.ts (how to use the function before in baseHandlers.ts)
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

// section two
// first of all,let's complete the class ReactiveEffect and Dep(initial release)
// effect.ts
class ReactiveEffect {
  private _fn: any;
  constructor(fn: any) {
    this._fn = fn;
  }
  run() {
    return this._fn();
  }
}
let activeEffect: ReactiveEffect;
// make use of the get and set of class-value
class Dep {
  public effects: Set<ReactiveEffect>;
  private _val: any;
  constructor(value) {
    this.effects = new Set();
    this._val = value;
  }
  get value() {
    this.depend();
    return this._val;
  }
  set value(val) {
    this._val = val;
    this.notify();
  }
  depend() {
    if (activeEffect) {
      if (this.effects.has(activeEffect)) return;
      this.effects.add(activeEffect);
    }
  }
  notify() {
    this.effects.forEach((effect: ReactiveEffect) => {
      effect.run();
    });
  }
}
let targetMap = new WeakMap();
// weakmap => obj-Object:map-Map => key-string:dep-Dep
function getDep(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep(target[key]);
    depsMap.set(key, dep);
  }
  return dep;
}

// section three
// how to realize the function track and trigger be commented in section one.
function track(target, key) {
  const dep = getDep(target, key);
  dep.depend();
}
function trigger(target, key) {
  const dep = getDep(target, key);
  dep.notify();
}

// section four
// how to use the class and function before
// effect.ts
function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}
export {};
