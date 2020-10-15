/**
 * 插入排序
 */

function insertSort(array) {
  if(Array.isArray(array) && array.length > 0) {
    let len = array.length;
    for(let i = 1; i < len; i++) {
      // 为什么要先存起来?
      const flag = array[i]; 
      let j;
      for(j = i ; j > 0 && array[j - 1] > flag; j--) {
        array[j] = array[j-1]
      }

      array[j]= flag;
    }
  }
  return array;
}

function insertSortHandler(array) {
  let result = array;
  insertSort(result);
  return result;
}