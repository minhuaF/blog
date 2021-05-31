/**
 * 代理模式
 * 创建一个代理对象，代理对象是对本体对象的一种功能扩充
 */

/**
 * xiaoming送花给A
 */
var Flower = function(){};

var xiaoming = {
  sendFlower: function(target) {
    var flower = new Flower();
    target.receiveFlower(flower);
  }
}

var A = {
  receiveFlower: function(flower) {
    console.log('收到花', flower)
  }
}

xiaoming.sendFlower(A);

//////////////////////////////////////////////////////////////////////////////////////

/**
 * 代理模式
 */

var Flower = function(){};

var xiaoming = {
  sendFlower: function(target) {
    var flower = new Flower();
    target.receiveFlower(flower)
  }
}

var A = {
  receiveFlower: function(flower) {
    console.log('收到花', flower)
  },
  listenFoodMood: function(fn) {
    setTimeout(function(){ // 假设10秒之后A的心情会变好
      fn();
    }, 100000)
  }
}

// 保护代理，帮A过滤
var B = {
  receiveFlower: function(flower){
    A.listenFoodMood(function(){
      A.receiveFlower(flower)
    })
  },
  // 虚拟代理，需要的时候才创建花(在javascript中比较常用)
  receiveFlower2: function() {
    A.listenFoodMood(function(){
      const flower = new Flower();
      A.receiveFlower(flower);
    })
  }
}

xiaoming.sendFlower(B);

//////////////////////////////////////////////////////////////////////////////////////

/**
 * 虚拟代理实现图片预加载
 */

var myImage = (function(){
  var imageNode = document.createElement('img');
  document.body.appendChild(imageNode);

  return {
    setSrc: function(src) {
      imageNode.src = src
    }
  }
})();

// 通过代理间接访问MyInage，proxyInage控制了客户对MyInage的访问，并加入了一些额外的操作
var proxyImage = (function(){
  var img = new Image;
  img.onload = function(){
    myImage.setSrc(this.src); // this 指向的是img
  }
  return {
    setSrc: function(src){
      myImage.setSrc('xxx/loading.gif');
      img.src = src;
    }
  }
})();

proxyImage.setSrc('xxx');


//////////////////////////////////////////////////////////////////////////////////////

// 有缓存的虚拟代理
var miniConsoleProxy = (function(){
  var cache = [];
  var handler = function(ev) {
    if(ev.keyCode === 113) {
      var script = document.createElement('script');
      script.onload = function(){
        // 执行缓存中的操作
        for(var i = 0, fn; fn = cache[i++]; ) {
          fn();
        }
      };
      script.src = 'miniConsole.js';
      document.getElementsByTagName('head')[0].appendChild(script);
      document.body.removeEventListener('keydown', handler); // 只加载一次miniConsole.js
    }
  }

  document.body.addEventListener('keydown', handler, false);

  return {
    log: function(){
      var args = arguments;
      cache.push(function(){
        return miniConsole.log.apply(miniConsole, args); // 本体
      })
    }
  }
})();


//////////////////////////////////////////////////////////////////////////////////////


/**
 * 缓存代理
 */

var mult = function(){
  console.log('开始计算乘积');
  var result = 1;
  for(var i = 0, l = arguments.length; i < l; i++) {
    result = result * arguments[i];
  }
  return result;
}

var proxyMult = (function(){
  var cache = {};
  return function(){
    var args = Array.prototype.join.call(arguments, ',');
    if(args in cache) {
      return cache[args];
    }

    return cache[args] = mult.apply(this, arguments);
  }
})();

proxyMult(1,2,3,4); // 24
proxyMult(1,2,3,4); // 24


//////////////////////////////////////////////////////////////////////////////////////


/**
 * 使用高阶函数动态创建代理
 */

var mult = function(){
  var result = 1;
  for(var i = 0, l = arguments.length; i < l; i ++) {
    result = result * arguments[i];
  }

  return result;
}

var plus = function(){
  var result = 0;
  for(var i = 0, l = arguments.length; i < l; i++) {
    result = result + arguments[i];
  }
  return result;
}

// 创建缓存代理工厂
var createProxyFactory = function(fn) {
  var cache = {};
  return function(){
    var args = Array.prototype.join.call(arguments, ',');
    if(args in cache) {
      return cache[args];
    }

    return cache[args] = fn.call(this, arguments);
  }
}

var proxyMult = createProxyFactory(mult);
var plusMult = createProxyFactory(plus);

proxyMult(1,2,3, 4); // 24
proxyMult(1,2,3, 4); // 24
proxyPlus(1,2,3, 4); // 10
proxyPlus(1,2,3, 4); // 10