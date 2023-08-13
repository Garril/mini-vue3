import { track, trigger } from './effect';
import { ReactiveFlags } from './reactive';

// create when it init,then the function won't be called many times.
const getter = createGetter(false);
const readonlyGetter = createGetter(true);
const setter = createSetter();

function createGetter(isReadonly: boolean = false) {
  return function get(target, key, receiver) {
    if (key == ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key == ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }
    const val = Reflect.get(target, key, receiver);
    if (!isReadonly) {
      track(target, key);
    }
    return val;
  };
}

function createSetter() {
  return function set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver);
    trigger(target, key);
    return res;
  };
}

export const mutableHandlers = {
  get: getter,
  set: setter,
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

export const readOnlyHandlers = {
  get: readonlyGetter,
  set(target, key, value) {
    console.warn(`key:${key} set failed.Because target is readonly`);
    return true;
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
