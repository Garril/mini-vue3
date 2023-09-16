export const isObject = (val) => {
  return val != null && typeof val == 'object';
};

export const hasChange = (val, newValue) => {
  // Object.is --> No type conversion is performed
  return !Object.is(val, newValue);
};

export const isOnEvent = (key: string) => {
  // is [A-Z],so onClick's "C" must be capitalized
  return /^on[A-Z]/.test(key);
};
