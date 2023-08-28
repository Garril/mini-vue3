import { shallowReadonly, isReadonly } from '../reactive';

describe('shallowReadonly', () => {
  test('should not make non-reactive properties reactive', () => {
    // the nest object in reactive obj shouldn't be reactive/readonly,this's shallow.
    const props = shallowReadonly({ n: { foo: 1 } });
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.n)).toBe(false);
  });
  it('warn when call set the readonly', () => {
    console.warn = jest.fn();
    const user = shallowReadonly({
      age: 10
    });
    user.age = 11;
    expect(console.warn).toBeCalled();
  });
});
