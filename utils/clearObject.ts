export default (obj: any,value=undefined): any => {
  if (!obj) return;
  const keys = Reflect.ownKeys(obj);
  let tmp = {};
  keys.forEach((key) => {
    Reflect.set(tmp, key, value);
  });
  return tmp;
};
