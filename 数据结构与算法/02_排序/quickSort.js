/**
 * 快速排序处理器
 * @param {number[]} array 
 * @param {number} left 
 * @param {number} right 
 */
function quickSortHandler(array, left, right) {
  if (left >= right) return ;

  let base = array[left]; // 基准数
  let i = left; // 从前往后
  let j = right; // 从后往前

  while (i < j) {
    // 从右往左找小于基准数的值
    while (array[j] >= base && i < j) {
      j--;
    }
    // 从左往右找大于基准数的值
    while (array[i] <= base && i < j) {
      i++;
    }
    [array[i], array[j]] = [array[j], array[i]]
  }

  // 当i和j相撞时,把相撞的位置和基准数交换
  [array[left], array[i]] = [array[i], array[left]]

  quickSortHandler(array, left, i - 1);
  quickSortHandler(array, i+1, right);
}

function quickSort(array) {
  // 不想改变原来数组
  let result  = array;
  quickSortHandler(result, 0, result.length - 1);
  return result;
}
