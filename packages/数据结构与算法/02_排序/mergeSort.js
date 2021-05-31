/**
 * 归并排序
 * 参考视频：https://v.qq.com/x/page/q0530l6gcat.html
 */

 function mergeSort(array) {
    if(array.length <= 1) return array;
    let left = array.slice(0, array.length/2);
    let right = array.slice(array.length/2);
    return mergeHandler(mergeSort(left), mergeSort(right))
 }

 function mergeHandler(left, right) {
  let temp = [];
  while(left.length > 0 && right.length > 0) {
    let x = left.shift(), y = right.shift();
    if(x <= y) {
      temp.push(x);
      right.unshift(y);
    } else {
      temp.push(y);
      left.unshift(x)
    }
  }

  return left.length === 0 ? temp.concat(right) : temp.concat(left);
 }