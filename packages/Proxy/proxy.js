/**
 * 参考：https://juejin.cn/post/6875247528565014535
 */
class Reactive extends EventTarget{
  // 由于需要自定义事件，所以需要继承EventTarget

  constructor(options) {
    super();
    this.$data = options.data;
    this.$el = document.querySelector(options.el);

    this.compile(this.$el);
    this.observer(this.$data)
  }

  // 观察数据变化，通知到视图
  observer(data) {
    let _this = this;

    this.$data = new Proxy(data, {
      set(target, prop, value) {
        let event = new CustomEvent(prop, {
          detail: value
        })

        _this.dispatchEvent(event);
        return Reflect.set(...arguments);
      }
    })
  }

  // 组合视图与数据
  compile(el) {
    // 1. 找到有绑定 v-model 的input
    // 2. 监测input改变，更新到data

    const nodes = el.childNodes;

    [...nodes].forEach(node => {
      // 是文本
      if(node.nodeType === 3) {
        const txt = node.textContent;
        const reg = 'reg'; // 匹配标识符的正则表达式

        if(reg.test(txt)) {
          const $1 = RegExp.$1; // 属性名

          if(this.$data[$1]) {
            node.textContent = txt.replace(reg, this.$data[$1]);
          }

          // 给每个属性注册当前属性需要监听的自定义事件
          this.addEventListener($1, e => {
            node.textContent = txt.replace(reg, e.detail);
          })
          
        }
      } else if(node.nodeType === 1){
        const attrs = node.attributes;
        // 找到有绑定数据的视图节点
        if(attrs.hasOwnProperty('v-model')) {
          const key = attrs['v-model'].nodeValue;

          node.value = this.$data[key];

          // dom 改变时需要同步到数据
          node.addEventListener('input', (e) => {
            this.$data[key] = e.target.value;
          })
        }

        // 不是文本的情况需要递归;
        this.compile(node)
      }
    })
  }
}

// data 怎么通知 view 更新 >>> 订阅观察者模式(自定义事件)
// view 怎么通知 data 更新 >>> 原生’input‘事件