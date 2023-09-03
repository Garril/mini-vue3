import { hasChange, isObject } from '../shared';
import { Dep, isTracking, trackEffects, triggerEffects } from './effect';
import { reactive } from './reactive';

class RefImpl {
  private _value: any = null;
  public dep: Dep;
  private _rawValue: any;
  public __v_isRef = true;
  /**
   *  Refs don't have as many keys as objects
   *  it only have value
   */
  constructor(value) {
    // save the data without transformed
    this._rawValue = value;
    // if value is an object, we should transform it to reactive
    this._value = convert(value);
    this.dep = new Dep(this._value);
  }
  get value() {
    if (isTracking()) {
      trackEffects(this.dep);
    }
    return this._value;
  }
  set value(newVal) {
    // if value is object,_value will be a proxy.
    if (!hasChange(this._rawValue, newVal)) return;
    this._rawValue = newVal;
    this._value = convert(newVal);
    triggerEffects(this.dep.effects);
  }
}

function convert(val) {
  return isObject(val) ? reactive(val) : val;
}

export function ref(value) {
  return new RefImpl(value);
}

export function isRef(raw: any) {
  return !!raw.__v_isRef;
}
export function unRef(raw: any) {
  return isRef(raw) ? raw.value : raw;
}

const proxyRefHandlers = {
  get(target, key) {
    return unRef(Reflect.get(target, key));
  },
  set(target, key, newVal) {
    if (!isRef(newVal) && isRef(target[key])) {
      return (target[key].value = newVal);
    } else {
      return Reflect.set(target, key, newVal);
    }
  }
};
export function proxyRefs(raw: any) {
  return new Proxy(raw, proxyRefHandlers);
}
