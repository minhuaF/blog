
最近在改用hooks开发，写着写着有点怀疑人生了，觉得自己用的很挫，只用用几个官方给的api，使用过程中，突然觉得这样的用法，和直接用封装和抽离函数，进行代码复用，并没有差很多。不禁有点迷茫，参考这文档编写着代码，回神却发现不知道自己写的是啥。

## Hooks 理念

### 代数效应

代数效应解答了我对hooks与函数相似的疑惑。代数效应在概念上跟“断点续传的 `try / catch` 没什么不同”。

```javascript
// 虚构的代码表示的代数效应
function getTotalCommentNum(id1, id2) {
  const num1 = getCommentNum(id1);
  const num2 = getCommentNum(id2);
  return num1 + num2;
}

function getCommentNum(id) {
  // NOTE: 此处有可能是同步也有可能是异步
  const num = perform id;
  return num;
}

try {
  getTotalCommentNum(1, 2);
} handle(id) {
  fetch(`http://xxx.com?id=${id}`).then(res => res.json()).then(({num}) => {
    resume with num;
  })
}

```