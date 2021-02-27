/**
 * 简易版react hooks
 * @see https://www.bilibili.com/video/BV1iV411b7L1?t=3863
 */

let isMount = true; // 区分是update还是mount
let workInProgressHook = null;

const fiber = {
    stateNode: App,
    memoizedState: null, // 保存state , 链表。保存每个hook数据
}

function useState(initialState) {
    // 解决当前hook对应哪个state
    // useState 为什么要保证顺序的理由，链表顺序不变
    let hook;
    if(isMount) {
        hook = {
            memoizedState: initialState,
            next: null,
            queue: { // 队列
                pending: null,
            }
        }
        if(!fiber.memoizedState) {
            fiber.memoizedState = hook;
        } else {
            workInProgressHook.next = hook; // 链表的形成
        }
        workInProgressHook = hook;
    } else {
        // update 时，链表已存在
        hook = workInProgressHook;
        workInProgressHook = workInProgressHook.next;
    }

    // 计算新的state
    let baseState = hook.memoizedState;
    if(hook.queue.pending) {
        let firstUpdate = hook.queue.pending.next;

        // 遍历链表
        do {
            const action = firstUpdate.action;
            baseState = action(baseState);
            firstUpdate = firstUpdate.next;
        } while ( firstUpdate !== hook.queue.pending.next) 

        hook.queue.pending = null;
    }
    hook.memoizedState = baseState;
    return [baseState, dispatchAction.bind(null, hook.queue)]
}


function dispatchAction(queue, action) {
    const update = { // 更新数据
        action,
        next: null
    }

    // 双向链表操作
    if(queue.pending === null) {
        // u0 -> u0 -> u0
        update.next = update;
    } else {
        // u1-> u0
        update.next = queue.pending.next;
        // u0 -> u1
        queue.pending.next = update
    }
    queue.pending = update;
    // 触发更新
    schedule();
}

function schedule() {
    workInProgressHook = fiber.memoizedState; // 当前调度的fiber
    const app = fiber.stateNode();
    isMount = false;
    return app;
}

function App() {
    const [num, updateNum] = useState(0);

    console.log('isMount', isMount);
    console.log('num', num);

    return {
        onClick() {
            updateNum(num => num + 1)
        }
    }
}

window.app = schedule();