// 标准单例模式
// 缺点：类并不是透明的，使用方式不能直接通过new XXX来获取对象
var Singleton = function(name) {
  this.name = name;
  this.instance = null;
}
Singleton.prototype.getName = function() {
  alert(this.name)
}
Singleton.getInstance = function(name) {
  if(!this.instance) {
    this.instance = new Singleton(name);
  }
  return this.instance
}

var a = Singleton.getInstance('name1');
var b = Singleton.getInstance('name2');

console.log(a === b); // true


// ---------------------------------


// 透明的单例模式
// 缺点：使用了自执行的匿名函数和闭包，让匿名函数返回真正的Singleton构造方法

var CreateDiv = (function(){
  var instance;
  var CreateDiv = function(html) {
    if(instance) {
      return instance;
    }
    this.html = html;
    this.init();
    instance = this;
    return instance;
  }

  CreateDiv.prototype.init = function() {
    var div = document.createElement('div');
    div.innerHTML = this.html();
    document.body.appendChild(div);
  }

  return CreateDiv;

})();

var a = new CreateDiv('div1');
var b = new CreateDiv('div2');

console.log(a === b) // true


// -----------------------------


// 用代理实现单例模式
// 缺点：自执行函数可能会造成浪费
var CreateDiv = function(html) {
  this.html = html;
  this.init();
}

CreateDiv.prototype.init = function() {
  var div = document.createElement('div');
  div.innerHTML = this.html;
  document.body.appendChild(div);
}

// 代理
var ProxySingletonCreateDiv = (function(){
  var instance;
  return function(name) {
    if(!instance) {
      return new CreateDiv(name);
    }

    return instance;
  }
})();

var a = new ProxySingletonCreateDiv('div1');
var b = new ProxySingletonCreateDiv('div2');

console.log(a===b); // true

// ----------------------------------------------


// 通用惰性单例：在需要时才创建实例
// 思考：使用了闭包，是否会对内存造成影响
// 减低全局变量带来的命名污染
// 1. 使用命名空间
// 2. 使用闭包封装私有变量
var getSingle = function(fn) {
  var result;
  return function(){
    return result || (result = fn.apply(this, arguments));
  }
}

var createSingleLoginLayer = getSingle(function() {
  var div = document.createElement('div');
  div.innerHTML = '登录弹窗';
  div.style.display = 'none';
  document.body.appendChild(div);
  return div;
})

document.getElementById('loginBtn').onClick = function() {
  var loginLayer = createSingleLoginLayer();
  loginLayer.style.display = 'block';
};

var createSingleIframe = getSingle(function(){
  var iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  return iframe;
})

document.getElementById('loginBrn').onClick = function() {
  var iframe = createSingleIframe();
  iframe.src = 'xxxx'
}
