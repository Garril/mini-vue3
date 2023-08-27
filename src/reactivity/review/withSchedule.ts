// Based on basic.ts, realize schedule.
// section one
// effect.ts
let activeEffect: ReactiveEffect;
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
      // change!
      if (effect.schedular) {
        effect.schedular();
      } else {
        effect.run();
      }
    });
  }
}
// we need a new property to save schedular
class ReactiveEffect {
  private _fn: any;
  public schedular: Function | undefined;
  constructor(fn: any, options?: any) {
    this._fn = fn;
    Object.assign(this, options);
  }
  run() {
    return this._fn();
  }
}
function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options);
  _effect.run();
}
/* 
  so remember that we save schedular in ReactiveEffect
  use it not in ReactiveEffect.run,but notify.
*/
export {};
