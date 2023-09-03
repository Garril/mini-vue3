import { reactive } from '../reactive';
import { computed } from '../computed';

describe('computed', () => {
  it('happy path', () => {
    const user = reactive({
      age: 1
    });
    const age = computed(() => {
      return user.age;
    });
    expect(age.value).toBe(1);
  });

  it.only('should compute lazily', () => {
    const obj = reactive({
      age: 18
    });
    const getter = jest.fn(() => {
      return obj.age;
    });
    const cacheValue = computed(getter);
    // lazy
    expect(getter).not.toHaveBeenCalled();
    /* 
      cacheValue.value will call the getter
      in computed get will call the _effect.run():
        1、set itself ActiveEffect
        2、run getter => the function passed in.
        3、reactive obj collect the ReactiveEffect.
    */
    expect(cacheValue.value).toBe(18);
    expect(getter).toHaveBeenCalledTimes(1);
    // should not compute because not change
    cacheValue.value;
    expect(getter).toHaveBeenCalledTimes(1);
    /* 
      notify and the computed's dirty changed to false by schedule.
      but the getter not executed,it can only be called by computed.value
    */
    obj.age = 22;
    expect(getter).toHaveBeenCalledTimes(1);
    // trigger getter of computed, value update
    expect(cacheValue.value).toBe(22);
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
