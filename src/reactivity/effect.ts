let activeEffect: ReactiveEffect;
const targetMap = new WeakMap();

export class Dep {
  private _val: any;
  private effects: Set<ReactiveEffect>;

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
    if (activeEffect) {
      this.effects.add(activeEffect);
    }
  }
  // 触发依赖
  notify() {
    this.effects.forEach((effect: ReactiveEffect) => {
      effect.run();
    });
  }
}

export class ReactiveEffect {
  private _fn: any;
  constructor(fn: any) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    this._fn();
  }
}

export function getDep(target, key) {
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

export function track(target, key) {
  const dep = getDep(target, key);
  dep.depend();
}
export function trigger(target, key) {
  const dep = getDep(target, key);
  dep.notify();
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}
