/**
 * 代码实现，参考B站上珠峰公开课
 */

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

/**
 * 完成promise特性-链式调用
 * @param {*} promise2 - 下一个promise
 * @param {*} x - 当前的promise的返回值
 * @param {*} resolve - 外面传进来的回调
 * @param {*} reject - 外面传进来的回调
 */
const resolvePromise = (promise2, x, resolve, reject) => {
  // 如果then的返回值和promise是同一个引用队形，造成循环引用，则抛出异常，把异常作为下一个then的错误处理返回「规范 Promise/A+ 2.2.7.3、2.2.7.4」
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // 控制每个then只调用一次
  let called;

  // 如果then不是普通的值
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try {
      // 缓存下一个then处理
      let then = x.then;
      if (typeof then === 'function') {
        // 如果下一个then存在，那么判断当前的peomise的状态，回调不同状态的函数
        // 这边不能用 x.then ，因为 x.then 直接取值有可能会获取到第三方promise的值
        then.call(x, y => {
          if (called) return;
          called = true;
          // 递归解析调用，实现链式调用
          resolvePromise(promise2, y, resolve, reject)
        }, error => {
          if (called) return;
          called = true;
          reject(error);
        })
      } else {
        // 如果下一个then并不是函数，则直接返回
        resolve(x)
      }

    } catch (error) {
      // 如果已经执行过了，就中断程序
      if (called) return;
      // 否则，作为error返回
      called = true;
      reject(error)
    }
  } else {
    // 如果then返回的是普通的值，那么直接返回 resolve 作为结果
    resolve(x)
  }
}

class PromiseSelf {
  constructor(executor) {
    // 默认状态是pending
    this.status = PENDING;
    // 成功的值
    this.value = undefined;
    // 失败理由
    this.reason = undefined;
    // 存放成功的回调
    this.onResolvedCallbacks = [];
    // 存放失败的回调
    this.onRejectedCallbacks = [];

    let resolve = (value) => {
      // resolve 得到的可能是一个promise
      if (value instanceof PromiseSelf) {
        // 递归解析
        return value.then(resolve, reject)
      }
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        if (this.onResolvedCallbacks.length) {
          this.onResolvedCallbacks.forEach(fn => fn())
        }
      }
    }

    let reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        if (this.onRejectedCallbacks.length) {
          this.onRejectedCallbacks.forEach(fn => fn())
        }
      }
    }

    try {
      executor(resolve.bind(this), reject.bind(this))
    } catch (e) {
      this.reject(e)
    }
  }

  // then 方法接受两个方法，分别处理两种状态
  then(onFulfilled, onRejected) {
    // onFulfilled\onRejected 可以缺省
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };

    // 每次调用then之后都是返回一个全新的PromiseSelf
    const promise2 = new PromiseSelf((resolve, reject) => {
      if (this.status === FULFILLED) {
        // NOTE：此处promise2在函数体内调用了自己；在v8中，此处是一个微任务，微任务会在当前任务队列为空的情况下才一次执行，所有不会报错
        // 但是v8的微任务机制是没有办法模拟的，所以可以使用另外的方式把此处变成异步，那么setTimeout就是比较友好的方式，虽然并不是微任务，而是宏任务，但是，可以模拟出异步的效果
        setTimeout(() => {
          try {
            // 获取到当前promise的返回值
            const x = onFulfilled(this.value);
            // 交由统一的处理器，处理promise的返回值
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            // 获取当前promise失败的返回值，并交由统一处理器处理
            const x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.status === PENDING) {

        // 调用then的时候当前promise状态还是 PENDING的话，需要将回调先存放起来，待状态改变之后才执行
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e)
            }
          }, 0)
        })

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            // NOTE：setTimeout中的error是不能被最外层的catch处理的，所有需要单独处理下
            try {
              const x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })
    return promise2;
  }

  /**
   * @param value - 可能是promise，可能是其他
   * @returns Promise
   */
  static resolve(value) {
    return new PromiseSelf((resolve, reject) => {
      resolve(value)
    })
  }

  static reject(reason) {
    return new PromiseSelf((resolve, reject) => {
      reject(reason)
    })
  }

  catch(errorCallback) {
    return this.then(null, errorCallback)
  }

  /**
   * 
   * @param {function} callback 
   * @returns promise 返回的是一个promise，后面可能还会继续链式处理
   */
  finally(callback) {
    return this.then((value) => {
      return PromiseSelf.resolve(callback()).then(() => value)
    }, (reason) => {
      return PromiseSelf.resolve(callback()).then(() => { throw reason })
    })
  }

  /**
   * 全部promise执行完毕之后，才返回，如果其中一个有reject，则直接返回
   * 判断是否全部执行完成的标准是用计数器，每次resolve之后累计，计数器等于数组长度时，即执行完全
   * @param {array} promises 
   * @returns 
   */
  all(promises) {
    if (!Array.isArray(promises)) {
      const type = typeof promises;
      throw new TypeError(`TypeError: ${type} ${promises} is not iterable`)
    }

    const len = promises.length;
    return new PromiseSelf((resolve, reject) => {
      let count = 0;
      let resultArray = [];

      const handleResultByKey = (p, i) => {
          count++;
          resultArray[i] = p;
          if(count === len) {
            resolve(resultArray)
          }
      }

      for (let i = 0; i < len; i++) {
        const p = promises[i];
        if (p && typeof p.then === 'function') {
          // 如果是成功的话，要记录长度，如果失败的话，直接reject
          p.then((value) => {
            handleResultByKey(value, i)
          }, reject)
        } else {
          handleResultByKey(p, i)
        }
      }
    })
  }

  // allSettled() {
  //   console.log('allSettled')
  // }

  /**
   * 传入的数组中，哪个状态比较快返回就用哪个，返回的也是一个promise
   * race的执行，哪个快就返回哪个，返回之后并不会中断其他的promise
   */
  race(promises) {
    if (!Array.isArray(promises)) {
      const type = typeof promises;
      throw new TypeError(`TypeError: ${type} ${promises} is not iterable`)
    }
    return new Promise((resolve, reject) => {
      for (let p of promises) {
        if (typeof p === 'function') {
          // 同步执行promise，只有其中有状态改变就直接改变并退出
          p.then(resolve, reject)
        } else {
          resolve(p)
        }
      }
    })
  }
}

/**
 *PromiseSelf/A+ 规范提供了一个专门的测试脚本
 */
PromiseSelf.defer = PromiseSelf.deferred = function () {
  let dfd = {};
  dfd.promise = new PromiseSelf((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd;
}

PromiseSelf.resolve(
  new PromiseSelf((resolve, reject) => {
    reject(3333)
  })
).then(data => {
  console.log(data)
}).catch(error => {
  console.log('error', error)
})

module.exports = PromiseSelf