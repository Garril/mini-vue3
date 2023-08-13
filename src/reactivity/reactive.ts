import { mutableHandlers, readOnlyHandlers } from './baseHandlers';

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

export function isReactive(obj) {
  // maybe passed in,not proxy.there is undefined
  return !!obj[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(obj) {
  return !!obj[ReactiveFlags.IS_READONLY];
}

function createActiveObject(raw: any, proxyHandler) {
  return new Proxy(raw, proxyHandler);
}
