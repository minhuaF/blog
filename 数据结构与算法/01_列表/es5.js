/**
 * es5 的实现方式
 * Date: 2020.09.26 08:46
 */

function List() {
  this.listSize = 0; // 列表的元素个数
  this.position = 0 ;  // 列表当前的位置
  this.dataStore = []; // 列表的数据
  this.length = length; // 列表的长度
  this.curPosition = curPosition; // 元素当前的位置
  this.clear = clear;
  this.find = find;
  this.findAll = findAll;
  this.toString = toString;
  this.insert = insert;
  this.append = append;
  this.remove = remove;
  this.front = front;
  this.end = end;
  this.prev = prev;
  this.next = next;
  this.moveTo = moveTo;
  this.getElement = getElement;
  this.has = has;
}

function front() {
  this.position = 0;
}

function end() {
  this.position = this.listSize - 1;
}

function prev() {
  if(this.position > 0) {
    --this.position;
  }
}

function next() {
  if(this.position < this.listSize) {
    ++this.position;
  }
}

function getElement() {
  return this.dataStore[this.position];
}

function curPosition() {
  return this.position;
}

function moveTo(position){
  this.position = position;
}

function toString() {
  // 数组变成字符串
  return this.dataStore.toString(); 
}

function remove(element) {
  var result = this.find(element);
  if(result > -1) {
    this.dataStore.splice(result, 1);
    --this.listSize;
    return;
  }

  return false;
}

function insert(element, after) {
  var insertPos = this.find(after);
  if(after > -1) {
    this.dataStore.splice(insertPos, 0, element);
    ++ this.dataStore.listSize;
    return insertPos;
  } else {
    // 找不到则在最后面追加
    this.append(element);
    ++ this.dataStore.listSize;
    return this.dataStore.listSize;
  }
}

function length() {
  return this.listSize;
}

function append(element) {
  return this.dataStore[this.listSize++] = element;
}

function has(element) {
  return this.find(element);
}

function clear() {
  delete this.dataStore;
  this.dataStore = [];
  this.position = 0;
  this.listSize = 0;
}

function find(element) {
  for(var i = 0; i < this.dataStore.length; i++) {
    if(this.dataStore[i] === element) {
      return i;
    }
  }

  return -1;
}

function findAll(element) {
  var result = [];
  for(var i = 0; i < this.dataStore.length; i++) {
    if(this.dataStore[i] === element) {
      result.push(i)
    }
  }

  if(result.length > 0) {
    return result;
  }

  return -1
}
