
/**
 * 装饰者模式
 */

var Plane = function(){}

Plane.prototype.fire = function(){
  console.log('发送普通子弹')
}


var MissileDecorator = function(plane){
  this.plane = plane;
}

MissileDecorator.prototype.fire = function(){
  this.plane.fire();
  console.log('发送导弹')
}

var AtomDecorator = function(plane) {
  this.plane = plane
}
// 链中的对象有相同的接口(fire)
AtomDecorator.prototype.fire = function(){
  this.plane.fire();
  console.log('发送原子弹');
}

var plane = new Plane();
plane = new MissileDecorator(plane);
plane = new AtomDecorator(plane);
plane.fire(); // 分别输出: 发送普通子弹、发射导弹、发射原子弹


/**
 * 使用Javascript方式编写
 */

var plane = {
  fire: function(){
    console.log('发送普通子弹')
  }
}

var missileDecorator = function(){
  console.log('发送导弹');
}

var atomDecorator = function(){
  console.log('发送原子弹')
}

var fire1 = plane.fire;

// 通过保存原引用的方式就可以改写某个函数；
plane.fire = function(){
  fire1();
  missileDecorator();
}

var fire2 = plane.fire;

plane.fire = function(){
  fire2();
  atomDecorator();
}

plane.fire(); // 分别输出：发送普通子弹、发送导弹、发送原子弹


/**
 * 通过保存原引用的方式达到改写函数的目的
 */

window.onload = function(){
  alert('1')
}

var _onload = window.onload || function(){};

window.onload = function(){
  _onload();
  alert('2')
}


/**
 * 中间函数处理this的指向
 */

var _getElementById = document.getElementById;

document.getElementById = function(id) {
  alert(2);
  return _getElementById.apply(document, arguments);
}

var button = document.getElementById('button');


/**
 * 通过AOP装饰函数
 */
// 污染原型
Function.prototype.before = function(beforeFn) {
  var _self = this;
  return function(){
    beforeFn.apply(this, arguments);
    return _self.apply(this, arguments);
  }
}

Function.prototype.after = function(afterFn) {
  var _self = this;
  return function(){
    var ret = _self.apply(this, arguments);
    afterFn.apply(this, arguments);
    return ret;
  }
}

// 普通函数
var before = function(fn, beforeFn) {
  return function(){
    beforeFn.apply(this, arguments);
    return fn.apply(this, arguments);
  }
}

var after = function(fn, afterFn) {
  return function(){
    var ret = fn.apply(this, arguments);
    afterFn.apply(this, arguments);
    return ret;
  }
} 

/**
 * 实际应用实例，表单校验
 */
// 常规的表单校验模式（平时对表单验证的时候可实践）
var validData = function(){
  if(username.value === '') {
    alert('用户名不能为空')
    return false;
  }
  if(password.value === '') {
    console.log('密码不能为空');
    return false;
  }

  return true;
}

var formSubmit = function(){
  if(validData() === false) {
    return false;
  }

  var param = {
    username: username.value,
    password: password.value
  }
  ajax('xxx', param);
}

submitBtn.onclick = function(){
  formSubmit();
}

// 使用装饰器模式之后
Function.prototype.before = function(beforeFn) {
  var _self = this;
  return function(){
    if(beforeFn.apply(this.arguments) === false) {
      return;
    }

    return _self.apply(this, arguments);
  }
}

var validata = function(){
  if(username.value === '') {
    alert('用户名不能为空');
    return false;
  }
  if(password.value === '') {
    alert('密码不能为空');
    return false;
  }
}

var formSubmit = function(){
  var param = {
    username: username.value,
    password: password.value
  }
  ajax('xxx', param);
}

formSubmit.before(validata);

submitBtn.onclick = function(){
  formSubmit();
}

