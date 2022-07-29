import { GameFrameworkError } from "../GameFrameworkError";

/**
 * 双链表节点
 */
export class LinkedListNode<T> {
    private _next: LinkedListNode<T> | null = null;
    private _previous: LinkedListNode<T> | null = null;
    private _value: T = null!;

    constructor(value: T) {
        this._value = value;
    }

    set next(value: LinkedListNode<T> | null) {
        this._next = value;
    }

    get next(): LinkedListNode<T> | null {
        return this._next;
    }

    set previous(value: LinkedListNode<T> | null) {
        this._previous = value;
    }

    get previous(): LinkedListNode<T> | null {
        return this._previous;
    }

    set value(value: T) {
        this._value = value;
    }

    get value(): T {
        return this._value;
    }

    clear() {
        this._value = null!;
        this._previous = null;
        this._next = null;
    }
}

/**
 * 双链表
 */
export class GameFrameworkLinkedList<T> {
    private _first: LinkedListNode<T> | null = null;
    private _last: LinkedListNode<T> | null = null;
    private _size: number = 0;
    private readonly _cacheNodes: Array<LinkedListNode<T>> = null!;

    constructor() {
        this._cacheNodes = new Array<LinkedListNode<T>>();
    }

    /**
     * 链表容量大小
     */
    get size(): number {
        return this._size;
    }

    /**
     * 头节点
     */
    get first(): LinkedListNode<T> | null {
        return this._first;
    }

    /**
     * 尾节点
     */
    get last(): LinkedListNode<T> | null {
        return this._last;
    }

    /**
     * 根据指定的值查找第一个符合的链表节点
     * @param value 指定的值
     * @param reverse 反向查找
     * @returns 链表节点或空
     */
    get(value: T, reverse: boolean = false): LinkedListNode<T> | null {
        let node: LinkedListNode<T> | null = null;
        if (reverse) {
            node = this.lastFind((memberValue: T) => {
                return value === memberValue;
            });
        } else {
            node = this.find((memberValue: T) => {
                return value === memberValue;
            });
        }
        return node;
    }

    /**
     * 链表中存在该指定的值值相等的节点
     * @param value 指定的值
     * @returns 链表中存在该指定的值值相等的节点
     */
    has(value: T): boolean {
        return this.get(value) != null;
    }

    /**
     * 查找符合比较函数的节点
     * @param compareToFn 比较函数
     * @param thisArg 函数this指针
     * @returns 链表节点
     */
    find(compareToFn: (value: T) => boolean, thisArg?: any): LinkedListNode<T> | null {
        let current = this._first;
        while (current) {
            if (compareToFn.call(thisArg, current.value)) {
                return current;
            }
            current = current.next;
        }

        return null;
    }

    /**
     * 从尾部查找符合比较函数的节点
     * @param compareToFn 比较函数
     * @param thisArg 函数this指针
     * @returns 链表节点
     */
    lastFind(compareToFn: (value: T) => boolean, thisArg?: any): LinkedListNode<T> | null {
        let current = this._last;
        while (current) {
            if (compareToFn.call(thisArg, current.value)) {
                return current;
            }
            current = current.previous;
        }

        return null;
    }

    /**
     * 链表头部添加新节点
     * @param value 指定的值
     */
    addFirst(value: T): void {
        if (this.size == 0) {
            this.addToEmpty(value);
        } else {
            this.addBefore(this._first!, value);
        }
    }

    /**
     * 链表尾部添加新节点
     * @param value 指定的值
     */
    addLast(value: T): void {
        if (this.size == 0) {
            this.addToEmpty(value);
        } else {
            this.addAfter(this._last!, value);
        }
    }

    /**
     * 在链表节点前添加一个新节点
     * @param node 链表节点
     * @param value 指定的值
     */
    addBefore(node: LinkedListNode<T>, value: T): void {
        if (!node) {
            throw new GameFrameworkError("node is invalid");
        }
        let newNode = this.acquireNode(value);
        newNode.next = node;
        newNode.previous = node.previous;
        if (newNode.previous) {
            newNode.previous.next = newNode;
        }
        node.previous = newNode;
        if (this._first == node) {
            this._first = newNode;
        }
    }

    /**
     * 在链表节点后添加一个新节点
     * @param node 链表节点
     * @param value 指定的值
     */
    addAfter(node: LinkedListNode<T>, value: T): void {
        if (!node) {
            throw new GameFrameworkError("node is invalid");
        }
        let newNode = this.acquireNode(value);
        newNode.previous = node;
        newNode.next = node.next;
        if (newNode.next) {
            newNode.next.previous = newNode;
        }
        node.next = newNode;
        if (node == this._last) {
            this._last = newNode;
        }
    }

    /**
     * 从链表中移除节点，或者移除与指定值相等的第一个节点
     * @param nodeOrValue 链表节点或者需要移除的值
     * @param reverse 反向查找与指定值相等的节点
     * @returns
     */
    remove(nodeOrValue: LinkedListNode<T> | T, reverse: boolean = false): boolean {
        if (nodeOrValue === undefined || nodeOrValue === null) {
            throw new GameFrameworkError("node or value is invalid");
        }

        let node: LinkedListNode<T> | null = nodeOrValue instanceof LinkedListNode ? nodeOrValue : this.get(nodeOrValue, reverse);
        if (node) {
            if (node.previous) {
                node.previous.next = node.next;
                if (node == this._last) {
                    this._last = node.previous;
                }
            }

            if (node.next) {
                node.next.previous = node.previous;
                if (node == this._first) {
                    this._first = node.next;
                }
            }

            this.releaseNode(node);

            if (this._size == 0) {
                this._first = this._last = null;
            }

            return true;
        }
        return false;
    }

    /**
     * 移除头部节点
     */
    removeFirst(): void {
        if (!this.first) {
            throw new GameFrameworkError("first is invalid");
        }
        this.remove(this.first);
    }

    /**
     * 移除尾部节点
     */
    removeLast(): void {
        if (!this.last) {
            throw new GameFrameworkError("last is invalid");
        }
        this.remove(this.last, true);
    }

    /**
     * 清除链表
     */
    clear() {
        let current = this._first;
        let next: LinkedListNode<T> | null = null;
        while (current) {
            next = current.next;
            this.releaseNode(current);
            current = next;
        }
        this._first = this._last = null;
    }

    /**
     * 清除所有缓存的节点
     */
    clearCacheNodes() {
        this._cacheNodes.length = 0;
    }

    /**
     * 头节点遍历到尾节点
     * @param callbackfn 遍历回调函数
     * @param thisArg 函数this指针
     */
    forEach(callbackfn: (value: T, index: number, linkedList: GameFrameworkLinkedList<T>) => void, thisArg?: any): void {
        let current = this._first;
        let listIndex = 0;
        while (current) {
            callbackfn.call(thisArg, current.value, listIndex++, this);
            current = current.next;
        }
    }

    private acquireNode(value: T): LinkedListNode<T> {
        if (value === undefined || value === null) {
            throw new GameFrameworkError("value is invalid");
        }
        ++this._size;
        if (this._cacheNodes.length > 0) {
            let node = this._cacheNodes.pop();
            if (node) {
                node.value = value;
                return node;
            }
        }
        return new LinkedListNode(value);
    }

    private releaseNode(node: LinkedListNode<T>): void {
        if (!node) {
            throw new GameFrameworkError("node is invalid");
        }
        node.clear();
        --this._size;
        this._cacheNodes.push(node);
    }

    private addToEmpty(value: T): void {
        let newNode = this.acquireNode(value);
        this._last = this._first = newNode;
    }

    [Symbol.iterator](): IterableIterator<T> {
        let current = this._first;
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
        return "GameFrameworkLinkedList";
    }
}
