import { readonly, isReadonly } from '../reactive';
describe('readonly', () => {
  it('make nested values readonly', () => {
    // can be set
    const original = { foo: 1, bar: { age: 2 } };
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(original)).toBe(false);
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
});
