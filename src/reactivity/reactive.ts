import { track, trigger } from './effect';
const reactiveHandlers = {
  get(target, key, receiver) {
    track(target, key);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver);
    trigger(target, key);
    return res;
  },
  // we can have other traps
  has() {
    // track operations like: xxx in state
    return true;
  },
  ownKey() {
    // track operations like: Object.keys(state)
    return true;
  }
};

export function reactive(raw) {
  return new Proxy(raw, reactiveHandlers);
}
