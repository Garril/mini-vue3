// Based on withSchedule.ts, realize return runner.
// section one
// effect.ts
let activeEffect: ReactiveEffect;
class ReactiveEffect {
  private _fn: any;
  public schedular: Function | undefined;
  constructor(fn: any, options?: any) {
    this._fn = fn;
    Object.assign(this, options);
  }
  run() {
    // change: there just return the result
    activeEffect = this;
    const res = this._fn();
    return res;
  }
}
function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  return runner;
}

export {};
/* 
the runner is the function which effect return.
it's not code in class ReactiveEffect,
but in function effect -- origin is -> ReactiveEffect.run.bind()

example:
  let foo = 10;
  const runner = effect(() => {
    foo++;
    return 'getReturn';
  });
  expect(foo).toBe(11);
  const res = runner();
  expect(foo).toBe(12);
  expect(res).toBe('getReturn');
*/
