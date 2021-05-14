/**
 * 发布-订阅模式
 */

// 最简单的发布-订阅模式
// 缺点：订阅者接收到了所有的消息
var salesOffices = {};
salesOffices.clientList = [];

// 添加订阅者
salesOffices.listen = function (fn) {
  this.clientList.push(fn);
}

// 发布消息
salesOffices.trigger = function () {
  for (let i = 0; i < this.clientList.length; i++) {
    var fn = this.clientList[i];
    fn.apply(this, arguments) // arguments 是发布消息时带上的参数
  }
}


// -----------------------

// 只订阅对应key的消息

var salesOffices = {};
salesOffices.clientList = {};

// 订阅消息
salesOffices.listen = function (key, fn) {
  if (!this.clientList[key]) {
    this.clientList[key] = []
  }

  this.clientList[key].push(fn);
}

salesOffices.trigger = function () {
  var key = Array.prototype.shift.call(arguments);
  var fns = this.clientList[key];

  if (!fns || fns.length == 0) {
    return false
  }

  for (var i = 0; i < fns.length; i++) {
    var fn = fns[i];
    fn.apply(this, arguments);
  }
}


////////////////////////////////////////////////////////////////////////////


// 通用模式 

var event = {
  clientList: [],
  listen: function (key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = []
    }

    this.clientList[key].push(fn);
  },
  trigger: function () {
    var key = Array.prototype.shift.call(arguments);
    var fns = this.clientList[key];

    if (!fns || fns.length === 0) return false;

    for (let i = 0; i < fns.length; i++) {
      var fn = fns[i];
      fn.apply(this, arguments); // 第一个key已经去除
    }
  },
  remove: function (key, fn) {
    var fns = this.clientList[key];

    if (!fns) {
      return false
    }

    if (!fn) {
      fns && (fns.length = 0)
    } else {
      for (var i = fns.length - 1; i >= 0; i--) {
        var _fn = fns[i];
        if (fn === _fn) {
          fns.splice(i, 1);
        }
      }
    }
  }
}

var installEvent = function (obj) { // 函数给所有对象都动态安装 发布-订阅 功能
  for (var i in event) {
    obj[i] = event[i]
  }
}

var salesOffices = {};
installEvent(salesOffices);

salesOffices.listen('listen1', function (data) {
  console.log(data)
});

salesOffices.listen('listen2', function (data) {
  console.log(data)
});

salesOffices.trigger('listen1', 1000);
salesOffices.trigger('listen2', 2000);


////////////////////////////////////////////////////////////////////////////


// 全局的发布-订阅模式
var Event = (function () {
  var clientList = {};
  var listen;
  var trigger;
  var remove;

  listen = function (key, fn) {
    if (!clientList[key]) {
      clientList[key] = [];
    }
    clientList[key].push(fn);
  }

  trigger = function () {
    var key = Array.prototype.shift.call(arguments);

    var fns = clientList[fns];

    if (!fns || fns.length == 0) return false;

    for (let i = 0; i < fns.length; i++) {
      var fn = fns[i];
      fn.apply(this, arguments);
    }
  }

  remove = function (key, fn) {
    var fns = clientList[key];

    if (!fns) return false;

    if (!fn) {
      fns && (fns.length = 0)
    } else {
      for (var i = fns.length - 1; i >= 0; i--) {
        var _fn = fns[i];
        if (_fn === fn) {
          fns.splice(i, 1)
        }
      }
    }
  }


  return {
    listen,
    trigger,
    remove
  }
})();

Event.listen('listen1', function (data) {
  console.log('listen1')
})

Event.trigger('listen2', function (data) {
  console.log('listen2')
})


////////////////////////////////////////////////////////////////////////////


// 先发布再订阅
// 全局事件的命名冲突

var Event = (function () {
  var global = this,
    Event,
    _default = 'default';

  Event = function () {
    var _listen,
      _trigger,
      _remove,
      _slice = Array.prototype.slice,
      _shift = Array.prototype.shift,
      _unshift = Array.prototype.unshift,
      namespaceCache = {},
      _create,
      each = function (ary, fn) {
        var ret;
        for (var i = 0, l = ary.length; i < l; i++) {
          var n = ary[i];
          ret = fn.call(n, i, n);
        }

        return ret;
      };

    _listen = function (key, fn, cache) {
      if (!cache[key]) {
        cache[key] = []
      }

      cache[key].push(fn);
    };

    _remove = function (key, cache, fn) {
      if (cache[key]) {
        if (fn) {
          for (var i = cache[key].length; i >= 0; i--) {
            if (cache[key][i] === fn) {
              cache[key].splice(i, 1)
            }
          }
        } else {
          cache[key] = []
        }
      }
    };

    _trigger = function () {
      var cache = _shift.call(arguments),
        key = _shift.call(arguments),
        args = arguments,
        _self = this,
        stack = cache[key];

      if (!stack || !stack.length) {
        return;
      }

      return each(stack, function () {
        return this.apply(_self, args)
      })
    };

    _create = function (namespace) {
      var namespace = namespace || _default;
      var cache = {},
        offlineStack = [], // 离线事件
        ret = {
          listen: function (key, fn, last) {
            _listen(key, fn, cache);

            if (offlineStack === null) {
              return;
            }

            if (last === 'last') {
              offlineStack.length && offlineStack.pop()();
            } else {
              each(offlineStack, function () {
                this();
              })
            }

            offlineStack = null;
          },
          one: function (key, fn, last) {
            _remove(key, cache);
            this.listen(key, cache, fn)
          },
          trigger: function () {
            var fn,
              args,
              _self = this;

            _unshift.call(arguments, cache);
            args = arguments;
            fn = function () {
              return _trigger.apply(_self, args);
            };
            if (offlineStack) {
              return offlineStack.push(fn);
            }

            return fn();
          }
        };

      return namespace ?
        (namespaceCache[namespace] ? namespaceCache[namespace] : namespaceCache[namespace] = ret)
        : ret;
    };

    return {
      create: _create,
      one: function (key, fn, last) {
        var event = this.create();
        event.one(key, fn, last);
      },
      remove: function (key, fn) {
        var event = this.create();
        event.remove(key, fn);
      },
      listen: function (key, fn, last) {
        var event = this.create();
        event.listen(key, fn, last);
      },
      trigger: function () {
        var event = this.create();
        event.trigger.apply(this, arguments)
      }
    }
  }();

  return Event;
})();