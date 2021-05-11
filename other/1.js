/**
 * 依次执行100, 2000, 300, 400, 5000, 600，写一个并发为2的处理事件，执行结果依次为 100， 300，400，2000，600，5000
 */

  class DelayHandler {
    constructor(props) {
        this.limitCount = props.limitCount;
        this.handlerList = []; // [100, 20000, 300, 400, 5000, 600]
        this.nextHandlerIndex = 0; // 当前的异步操作下标
    }

    run() {
        console.log('this.handlerList => ', this.handlerList)
        this._mapHandler();
    }

    _handler(value) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('value=> ', value);
                if(this.nextHandlerIndex < this.handlerList.length) {
                    this._handler(this.handlerList[this.nextHandlerIndex ++])
                }
            }, value);
        })
    }

    _mapHandler() {
        let asnycHandlerList = []; // 并发中的异步操作 
        for(let i = 0; i < this.limitCount; i++) {
            this.nextHandlerIndex ++ ;
            asnycHandlerList.push(this._handler(this.handlerList[i]));
        }

        return Promise.all(asnycHandlerList);
    }

    add(delay) {
        this.handlerList.push(delay);
    }
  }


  const delayHandler = new DelayHandler(2);
  delayHandler.add(100);
  delayHandler.add(2000);
  delayHandler.add(300);
  delayHandler.add(400);
  delayHandler.add(5000);
  delayHandler.add(600);

  delayHandler.run()