/**
 * 属性装饰器
 */

function logProperty(target, key) {
  let value;
  const getter = function() {
    console.log(`Get => ${key}`);
    return value;
  }

  const setter = function(newVal) {
    console.log(`Set: ${key} => ${newVal}`);
    value = newVal;
  }

  Object.defineProperty(target, key, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true
  })
}