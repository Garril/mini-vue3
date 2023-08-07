let curEffect = null;

export class Dep {
  constructor(value) {
    this._val = value;
    this.effects = new Set();
  }
  get value() {
    this.depend();
    return this._val;
  }
  set value(val) {
    this._val = val;
    this.notify();
  }
  // 收集依赖
  depend() {
    if (curEffect) {
      this.effects.add(curEffect);
    }
  }
  // 触发依赖
  notify() {
    this.effects.forEach((effect) => {
      effect.run();
    });
  }
}

class ReactiveEffect {
  private _fn: any;
  constructor(fn) {
    this._fn = fn;
  }
  run() {
    curEffect = this;
    return this._fn();
  }
}

export function effectWatch(fn) {
  curEffect = new ReactiveEffect(fn);
  curEffect.run();
  return curEffect.run.bind(curEffect);
}

const targetMap = new WeakMap();

function getDep(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }
  return dep;
}

const reactiveHandlers = {
  get(target, key, receiver) {
    const dep = getDep(target, key);
    dep.depend();
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    const dep = getDep(target, key);
    const res = Reflect.set(target, key, value, receiver);
    dep.notify();
    return res;
  },
  // we can have other traps
  has() {
    // track operations like: xxx in state
  },
  ownKey() {
    // track operations like: Object.keys(state)
  },
};

export function reactive(raw) {
  return new Proxy(raw, reactiveHandlers);
}
