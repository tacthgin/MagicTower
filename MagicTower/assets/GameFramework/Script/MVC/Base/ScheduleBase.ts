import { GameFrameworkLinkedList, LinkedListNode } from "../../Base/Container/GameFrameworkLinkedList";
import { GameFrameworkError } from "../../Base/GameFrameworkError";
import { ReferencePool } from "../../Base/ReferencePool/ReferencePool";
import { ScheduleInfo } from "./ScheduleInfo";

export class ScheduleBase {
    private readonly _scheduleHandlers: GameFrameworkLinkedList<ScheduleInfo> = null!;

    constructor() {
        this._scheduleHandlers = new GameFrameworkLinkedList<ScheduleInfo>();
    }

    /**
     * 关闭并清理定时器
     */
    shutDown(): void {
        this._scheduleHandlers.forEach((scheduleInfo: ScheduleInfo) => {
            ReferencePool.release(scheduleInfo);
        });
        this._scheduleHandlers.clear();
    }

    /**
     * 开启定时器
     * @param handler 回调函数
     * @param interval 定时器间隔
     * @param count 定时个数,默认为无限大
     * @param priority 定时器优先级
     */
    schedule(handler: Function, interval: number, count: number = Number.MAX_SAFE_INTEGER, priority: number = 0): void {
        if (interval < 0) {
            throw new GameFrameworkError("interval is invalid");
        }

        if (count <= 0) {
            throw new GameFrameworkError("count is invalid");
        }

        let scheduleInfo = ScheduleInfo.create(handler, this, interval, count, priority);
        let node: LinkedListNode<ScheduleInfo> | null = null;
        if (this._scheduleHandlers.size > 0) {
            for (let current = this._scheduleHandlers.first; current != null; current = current.next) {
                if (scheduleInfo.priority >= current.value.priority) {
                    node = current;
                    break;
                }
            }
        }

        if (node) {
            this._scheduleHandlers.addBefore(node, scheduleInfo);
        } else {
            this._scheduleHandlers.addLast(scheduleInfo);
        }
    }

    /**
     * 开启一次定时器
     * @param handler 回调函数
     * @param interval 定时器间隔
     * @param priority 定时器优先级
     */
    scheduleOnce(handler: Function, interval: number, priority: number = 0): void {
        this.schedule(handler, interval, 1, priority);
    }

    /**
     * 取消定时器
     * @param handler 回调函数
     */
    unschedule(handler: Function) {
        let node = this._scheduleHandlers.find((scheduleInfo: ScheduleInfo) => {
            return scheduleInfo.handler === handler;
        }, this);

        if (node) {
            this._scheduleHandlers.remove(node);
            ReferencePool.release(node.value);
        }
    }

    /**
     * 轮询定时器
     * @param elapseSeconds 逻辑流逝时间
     */
    update(elapseSeconds: number): void {}

    /**
     * 内部轮询定时器
     * @param elapseSeconds 逻辑流逝时间
     */
    internalUpdate(elapseSeconds: number): void {
        if (this._scheduleHandlers.size != 0) {
            let current: LinkedListNode<ScheduleInfo> | null = this._scheduleHandlers.first;
            let next: LinkedListNode<ScheduleInfo> | null = null;
            while (current) {
                current.value.update(elapseSeconds);
                if (current.value.isStoped()) {
                    next = current.next;
                    ReferencePool.release(current.value);
                    this._scheduleHandlers.remove(current);
                    current = next;
                } else {
                    current = current.next;
                }
            }
        }
    }
}
