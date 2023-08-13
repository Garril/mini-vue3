let activeEffect: ReactiveEffect;
const targetMap = new WeakMap();

export class Dep {
  private _val: any;
  public effects: Set<ReactiveEffect>;

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
      activeEffect.deps.push(this);
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
  public deps: Array<any>;
  private active: boolean = true;
  public scheduler: Function | undefined;
  public onStop?: () => void;
  constructor(fn: any, options?: any) {
    this._fn = fn;
    this.deps = [];
    Object.assign(this, options);
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
  stop() {
    this.active && cleanupEffect(this);
    this.onStop && this.onStop();
    this.active = false;
  }
}

function cleanupEffect(effect: ReactiveEffect) {
  effect.deps.forEach((dep: Dep) => {
    dep.effects.delete(effect);
  });
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
  const _effect = new ReactiveEffect(fn, options);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}
