let curEffect = null;

export class Dep {
  constructor(value) {
    this._val = value;
    this.effects = new Set();
  }
  get value() {
    this.depend()
    return this._val;
  }
  set value(val) {
    this._val = val;
    this.notice()
  }
  // 收集依赖
  depend() {
    if (curEffect) {
      this.effects.add(curEffect);
    }
  }
  // 触发依赖
  notice() {
    this.effects.forEach((effect) => {
      effect();
    });
  }
}

export function effectWatch(fn) {
  curEffect = fn;
  fn();
  curEffect = null;
}
