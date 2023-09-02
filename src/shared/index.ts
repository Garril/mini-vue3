export const isObject = (val) => {
  return val != null && typeof val == 'object';
};

export const hasChange = (val, newValue) => {
  // Object.is --> No type conversion is performed
  return !Object.is(val, newValue);
};
