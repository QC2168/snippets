export default (obj: any): any => {
  if (!obj) return;
  const keys = Reflect.ownKeys(obj);
  let tmp = {};
  keys.forEach((key) => {
    Reflect.set(tmp, key, undefined);
  });
  return tmp;
};
