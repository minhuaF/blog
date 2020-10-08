/**
 * 冒泡排序处理器
 * @param {number[]} array 
 */
function bubbleSortHandler(array) {
  for(let i = 0; i < array.length - 1; i++) {
    for(let j = 0;j < array.length - 1 - i; j++) {
      if(array[j] > array[j + 1]) {
        [array[j], array[j+1]] = [array[j+1], array[j]]
      }
    }
  }
  console.warn('冒泡排序结果', array)
}

function bubbleSort(array) {
  let result  = array;
  bubbleSortHandler(result);
  return result;
}
