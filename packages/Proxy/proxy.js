
/**
 * 参考：https://juejin.cn/post/6875247528565014535
 */
class Reactive extends EventTarget{
  constructor(options) {
    super();
    this.options = options;

    this.$data = this.options.data;

    this.el = document.querySelector(this.options.el);

    this.compile(this.el);

    this.observe(this.$data)
  }

  observe(data) {
    // 备份this?
    let _this = this;

    this.$data = new Proxy(data, {
      // 设置数据时，通知视图要更新
      set(target, prop, value) {
        // 创建一个自定义事件，初始化时创建数据
        // 第一个参数 事件的类型名称
        // detail: 当事件初始化时传递的数据
        let event = new CustomEvent(prop, {
          detail: value
        })
        // 派发事件
        _this.dispatchEvent(event);
        // 保持原来的set操作: Reflect.set 方法允许你在对象上设置属性
        return Reflect.set(...arguments);
      }
    })
  }

  compile(el) {
    // 遍历找到替换符，对data进行替换

    let child = el.childNodes;

    [...child].forEach(node => {
      // 如果node类型是Text_node
      if(node.nodeType === 3) {
        // 拿到文本内容，替换data
        let txt = node.textContent;

        // 正则
        let reg = /\{\{\s*([^\s\{\}]+)\s*\}\}/g;
        if(reg.test(txt)) {
          let $1 = RegExp.$1;
          if(this.$data[$1]) {
            node.textContent = txt.replace(reg, this.$data[$1])
          }
          // 绑定自定义事件
          // 接收数据的事件，更新到视图
          this.addEventListener($1, e => {
            // 替换成传进来的detail
            node.textContent = txt.replace(reg, e.detail);
          })
        }
        // 如果 node的类型是ELEMENT_NODE
      } else if(node.nodeType === 1){
        const attr = node.attributes;

        if(attr.hasOwnProperty('v-model')) {
          const keyName = attr['v-model'].nodeValue;

          node.value = this.$data[keyName];

          // 视图要更新时，通知数据要更新
          node.addEventListener('input', e => {
            this.$data[keyName] = node.value
          })
        }

        // 递归执行
        this.compile(node);
      }
    })
  }
}