import {
  mutableHandlers,
  readOnlyHandlers,
  shallowReadonlyHandlers
} from './baseHandlers';

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createActiveObject(raw, readOnlyHandlers);
}
export function shallowReadonly(raw) {
  return createActiveObject(raw, shallowReadonlyHandlers);
}

// judge reactive: return boolean
export function isReactive(obj) {
  // maybe passed in,not proxy.there is undefined
  return !!obj[ReactiveFlags.IS_REACTIVE];
}
// judge readonly: return boolean
export function isReadonly(obj) {
  return !!obj[ReactiveFlags.IS_READONLY];
}
// check if an object is a proxy created by reactive/readonly
export function isProxy(raw) {
  return isReactive(raw) || isReadonly(raw);
}

// create reactive obj
function createActiveObject(raw: any, proxyHandler) {
  return new Proxy(raw, proxyHandler);
}
