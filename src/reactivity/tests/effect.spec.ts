import { reactive } from '../reactive';
import { effect } from '../effect';
describe('effect', () => {
  // monitor data changes
  it('happy path', () => {
    const user = reactive({
      age: 10
    });
    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);
    // update
    user.age++;
    expect(nextAge).toBe(12);
  });
  // effect(fn) -> function(runner) -> fn -> get return
  it('should return runner when call effect', () => {
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return 'getReturn';
    });
    expect(foo).toBe(11);
    const res = runner();
    expect(foo).toBe(12);
    expect(res).toBe('getReturn');
  });
  // scheduler
  it('scheduler', () => {
    // 当effect第一次执行时，执行fn
    // 当响应式对象发生set时，更新不会执行fn，而是scheduler
    // 如果执行effect返回的runner的时候，则会再次执行fn
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      // pass the second param
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    expect(run).toBe(undefined);
    obj.foo++;
    expect(run).not.toBe(undefined);
    expect(scheduler).toHaveBeenCalledTimes(1);
    // should not run yet
    expect(dummy).toBe(1);
    // manually run
    run();
    // should have run
    expect(dummy).toBe(2);
  });
});
