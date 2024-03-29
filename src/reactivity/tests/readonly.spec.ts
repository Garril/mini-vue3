import { readonly, isReadonly, isProxy } from '../reactive';

describe('readonly', () => {
  it('make nested values readonly', () => {
    // can be set
    const original = { foo: 1, bar: { age: 2 } };
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(original)).toBe(false);
    expect(isReadonly(wrapped.bar)).toBe(true);
    expect(isReadonly(original.bar)).toBe(false);
    expect(wrapped.foo).toBe(1);
  });

  it('warn when call set the readonly', () => {
    console.warn = jest.fn();
    const user = readonly({
      age: 10
    });
    user.age = 11;
    expect(console.warn).toBeCalled();
  });
  test('check if an object is a proxy created by readonly', () => {
    const original = { age: 18 };
    const wrapped = readonly(original);
    expect(isProxy(wrapped)).toBe(true);
  });
});
