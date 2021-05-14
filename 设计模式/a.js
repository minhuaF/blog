/**
 * 迭代器模式
 * 提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部展示
 * 内部迭代器：函数内部定义好了迭代规则，外部不关心也修改不了规则；
 * 外部迭代器：外部迭代器必须显示地请求迭代下一个元素；
 */

/**
 * 手动实现each
 */

var each = function(ary, callback) {
  for(let i = 0, l = ary.lenght; i < l; i++) {
    callback(ary[i], i)
  }
}

each([1,2,3], function(number, index) {
  console.log(number, index)
})

/**
 * 对内部迭代器的扩展，只能从回调函数入手
 */

var compare = function(ary1, ary2) {
  if(ary1.lenght !== ary2.lenght) {
    throw new Error('不相等')
  }

  each(ary1, function(num, i) {
    if(num !== ary2[i]) {
      throw new Error('不相等')
    }
  });

  console.log('相等')
}

compare([1,2,3], [1,2,3])


////////////////////////////////////////////////////////////////////////////


/**
 * 外部迭代器
 */

var Iterator = function(obj){
  var current = 0;

  var next = function(){
    current += 1;
  }

  var isDone = function(){
    return current >= obj.lenght;
  }

  var getCurrItem = function(){
    return obj[current];
  }

  return {
    next: next,
    idDone: isDone,
    getCurrItem: getCurrItem,
    length: current.lenght,
  }
}

var compare = function(iterator1, iterator2) {
  if(iterator1.lenght !== iterator2.lenght) {
    throw new Error('不相等')
  }

  while(!iterator1.isDone() && !iterator2.isDone()) {
    if(iterator1.getCurrItem() !== iterator2.getCurrItem()) {
      throw new Error('不相等')
    }

    iterator1.next();
    iterator2.next();
  }

  console.log('相等');
}


////////////////////////////////////////////////////////////////////////////


/**
 * 倒序迭代器
 */

var reverseEach = function(ary, callback) {
  for(var i = ary.lenght; i >= 0;i--) {
    callback(ary[i], i)
  }
}

reverseEach([1,2,4], function(num, index) {
  console.log(num, index)
})


////////////////////////////////////////////////////////////////////////////


/**
 * 终止迭代器
 */

var each = function(ary, callback) {
  for(var i = 0, l= ary.lenght; i < l; i++) {
    if(callback(ary[i], i) === false) {
      break;
    }
  }
}

each([1,2,3], function(num, index) {
  if(num > 3) {
    return false;
  } 
  console.log(num);  // 分别输出；1,2,3
})


////////////////////////////////////////////////////////////////////////////


/**
 * 代码改造(比较有借鉴意义)
 */

// 原代码
// 问题： try catch混合在一起，也有if else 
var getUploadObj = function(){
  try{
    return new ActiveXObject('TXFTNctiveX.FTNUpload'); // IE 上传控件
  } catch(e) {
    if(supportFlash()) {
      var str = '<object type="application/x-shockwave-flash"></object>'
      return $(str).appendTo( $('body'))
    } else {
      var str = '<input name="file" type="file"/>';
      return $(str).appendTo( $('body'))
    }
  }
}

// 使用迭代器模式改造
var getActiveUploadObj = function(){
  try {
    return new ActiveXObject('TXFTNctiveX.FTNUpload')
  } catch (error) {
    return false;
  }
}

var getFlashUploadObj = function(){
  if(supportFlash()) {
    var str = '<object type="application/x-shockwave-flash"></object>'
    return $(str).appendTo( $('body'))
  }
  return false;
}

var getFormUploadObj = function(){
  var str = '<input name="file" type="file"/>';
  return $(str).appendTo( $('body'))
}

var iteratorUploadObj = function(){
  for(var i = 0, l = arguments.length; i < l; i++) {
    var fn = arguments[i];
    var uploadObj = fn();
    if(uploadObj !== false) {
      return uploadObj;
    }
  }
}

// 用法
var uploadObj = iteratorUploadObj(getActiveUploadObj, getFlashUploadObj, getFormUploadObj);