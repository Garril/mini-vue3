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
      if (effect.scheduler) {
        effect.scheduler();
      } else {
        effect.run();
      }
    });
  }
}

export class ReactiveEffect {
  private _fn: any;
  public scheduler: any;
  constructor(fn: any, scheduler?: any) {
    this._fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    activeEffect = this;
    return this._fn();
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

export function effect(fn, options: any = {}) {
  const { scheduler } = options;
  const _effect = new ReactiveEffect(fn, scheduler);
  _effect.run();
  const runner = _effect.run.bind(_effect);
  return runner;
}
