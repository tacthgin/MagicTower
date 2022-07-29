import { GameFrameworkLinkedList } from "./GameFrameworkLinkedList";

/**
 * 游戏框架队列,基于链表实现
 */
export class GameFrameworkQueue<T> {
    private _list: GameFrameworkLinkedList<T> = null!;

    constructor() {
        this._list = new GameFrameworkLinkedList<T>();
    }

    get size(): number {
        return this._list.size;
    }

    /**
     * 推入数据
     * @param value 数据
     */
    push(value: T): void {
        this._list.addLast(value);
    }

    /**
     * 弹出数据
     * @returns 数据
     */
    pop(): T | null {
        let first = this._list.first;
        if (first) {
            let value = first.value;
            this._list.removeFirst();
            return value;
        }

        return null;
    }

    /**
     * 获取头部数据
     * @retruns 头部数据
     */
    peek(): T | null {
        let first = this._list.first;
        return first ? first.value : null;
    }

    /**
     * 遍历队列元素
     * @param callbackfn 遍历回调函数
     * @param thisArg 函数this指针
     */
    forEach(callbackfn: (value: T, index: number, queue: GameFrameworkQueue<T>) => void, thisArg?: any): void {
        this._list.forEach((value: T, index: number) => {
            callbackfn.call(thisArg, value, index, this);
        });
    }

    /**
     * 清除队列
     */
    clear() {
        this._list.clear();
    }

    /**
     * 清除所有缓存的节点
     */
    clearCacheNodes() {
        this._list.clearCacheNodes();
    }

    [Symbol.iterator](): IterableIterator<T> {
        let current = this._list.first;
        return {
            next() {
                if (current) {
                    let value = current.value;
                    current = current.next;
                    return { done: false, value: value } as unknown as IteratorYieldResult<T>;
                } else {
                    return { done: true, value: undefined } as unknown as IteratorReturnResult<T>;
                }
            },

            [Symbol.iterator](): IterableIterator<T> {
                return this;
            },
        };
    }

    get [Symbol.toStringTag](): string {
        return "GameFrameworkQueue";
    }
}
