import { hasChange, isObject } from '../shared';
import { Dep, isTracking, trackEffects, triggerEffects } from './effect';
import { reactive } from './reactive';

class RefImpl {
  private _value: any = null;
  public dep: Dep;
  private _rawValue: any;
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