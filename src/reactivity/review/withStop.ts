// Based on withReturn.ts, realize stop.
// section one
// effect.ts
let activeEffect: ReactiveEffect;

class ReactiveEffect {
  private _fn: any;
  public schedular: Function | undefined;
  // change: we should add these
  public onStop?: () => void;
  // the deps whose effect collect "this" ReactiveEffect
  public deps: Array<any>;
  // the status to distinguish whether we should empty the deps or not
  private active: boolean = true;
  constructor(fn: any, options?: any) {
    this._fn = fn;
    // save the deps that collect "this" ReactiveEffect
    this.deps = [];
    // there the onStop attach to "this" like schedule
    Object.assign(this, options);
  }
  run() {
    activeEffect = this;
    const res = this._fn();
    return res;
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
// when we depend / collect ReactiveEffect, should collect Dep meanwhile.
class Dep {
  private _val: any;
  public effects: Set<ReactiveEffect>;
  constructor(value) {
    this._val = value;
    this.effects = new Set();
  }
  depend() {
    if (activeEffect) {
      if (this.effects.has(activeEffect)) return;
      // change: ReactiveEffect collect the deps that collect it.
      activeEffect.deps.push(this);
      this.effects.add(activeEffect);
    }
  }
  // ....
}
// traversal the deps whose effects collect "this" ReactiveEffect
// delete "this" ReactiveEffect from Dep.effects
function cleanupEffect(effect: ReactiveEffect) {
  effect.deps.forEach((dep: Dep) => {
    dep.effects.delete(effect);
  });
  effect.deps.length = 0;
}

function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  // change: runner need to be able to find its effect:ReactiveEffect
  runner.effect = _effect;
  return runner;
}

// get the runner effect return and then call the stop.
function stop(runner) {
  runner.effect.stop();
}

export {};
/* 
example-stop:
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    obj.prop = 3;
    expect(dummy).toBe(2);
    // stopped effect should still be manually callable
    runner();
    // if you change call runner to  obj.prop++
    // it won't be right,because it's get and then set,but only set
    // it equals obj.prop = obj.prop + 1. when you get,it will track again.
    // so we need adding the variable "shouldTrack"
    expect(dummy).toBe(3);

example-onStop:
    const obj = reactive({
      foo: 1
    });
    const onStop = jest.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        onStop
      }
    );
    stop(runner);
    expect(onStop).toBeCalledTimes(1);
*/

// section two
// in example-stop,we can see the problem when we use obj.prop++
// We have to let it know that it doesn't need to track
let shouldTrack: boolean;
function isTracking() {
  return shouldTrack && activeEffect2 != undefined;
}
// no change
const targetMap = new WeakMap();
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
function track(target, key) {
  // add this, when the "obj.prop++" 's  get operation
  // if the obj has been stop(obj),it would return but collect dependence
  if (!isTracking()) return;
  const dep = getDep(target, key);
  dep.depend();
}
/* 
  we should know that track -> dep.depend -> get fn's ReactiveEffect
  trigger -> traverse to call the ReactiveEffect.run()
  when "obj.prop++" 's get is over, the next is set,it will call the run method
  so we need to do something in the run method
*/
let activeEffect2: ReactiveEffect2;
class ReactiveEffect2 {
  private active: boolean = true;
  private _fn: any;
  run() {
    // has been stopped
    if (!this.active) {
      return this._fn();
    }
    activeEffect2 = this;
    shouldTrack = true;
    const res = this._fn();
    shouldTrack = false;
    return res;
  }
}
/* 
  final: when it has been stopped,just return this._fn()
  the _fn will call the track again.
  because the _fn just like this:
    const runner = effect(() => {
      dummy = obj.prop;
    });
  but it won't be track like normal reactive obj similarly.
*/
