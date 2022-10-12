import { GameFrameworkLinkedList, LinkedListNode } from "../../Base/Container/GameFrameworkLinkedList";
import { GameFrameworkMap } from "../../Base/Container/GameFrameworkMap";
import { GameFrameworkError } from "../../Base/GameFrameworkError";
import { ReferencePool } from "../../Base/ReferencePool/ReferencePool";
import { IScheduleBase } from "./IScheduleBase";
import { ScheduleInfo } from "./ScheduleInfo";

/**
 * 定时器管理器
 */
export class ScheduleManager {
    /** 定时器句柄 */
    private static readonly _scheduleHandlers: GameFrameworkLinkedList<ScheduleInfo> = new GameFrameworkLinkedList<ScheduleInfo>();
    /** 定时器信息表 */
    private static readonly _scheduleMap: GameFrameworkMap<IScheduleBase, ScheduleInfo> = new GameFrameworkMap<IScheduleBase, ScheduleInfo>();
    /** 帧更新表 */
    private static readonly _updateMap: Set<IScheduleBase> = new Set<IScheduleBase>();

    /**
     * 加入帧更新池
     * @param target 定时器目标
     */
    static addToUpdatePool(target: IScheduleBase): void {
        this._updateMap.add(target);
    }

    /**
     * 从帧更新池移除
     * @param target 定时器目标
     */
    static removeFromUpdatePool(target: IScheduleBase): void {
        this._updateMap.delete(target);
    }

    /**
     * 开启定时器
     * @param handler 回调函数
     * @param target 定时器目标
     * @param interval 定时器间隔
     * @param count 定时个数,默认为无限大
     * @param priority 定时器优先级
     */
    static schedule(handler: Function, target: IScheduleBase, interval: number, count: number = Number.MAX_SAFE_INTEGER, priority: number = 0): void {
        if (interval < 0) {
            throw new GameFrameworkError("interval is invalid");
        }

        if (count <= 0) {
            throw new GameFrameworkError("count is invalid");
        }

        let currentScheduleInfo = ScheduleInfo.create(handler, target, interval, count, priority);
        let node: LinkedListNode<ScheduleInfo> | null = this._scheduleHandlers.find((scheduleInfo) => {
            return currentScheduleInfo.priority >= scheduleInfo.priority;
        });

        if (node) {
            this._scheduleHandlers.addBefore(node, currentScheduleInfo);
        } else {
            this._scheduleHandlers.addLast(currentScheduleInfo);
        }

        this._scheduleMap.set(target, currentScheduleInfo);
    }

    /**
     * 取消定时器
     * @param handler 回调函数
     * @param target 定时器目标
     */
    static unschedule(handler: Function, target: IScheduleBase): void {
        let scheduleHandles = this._scheduleMap.get(target);
        if (scheduleHandles) {
            let node = scheduleHandles.find((scheduleInfo: ScheduleInfo) => {
                return scheduleInfo.handler === handler && scheduleInfo.target === target;
            }, this);

            if (node) {
                ReferencePool.release(node.value);
                this._scheduleHandlers.remove(node);
                scheduleHandles.remove(node);
            }
        }
    }

    /**
     * 取消目标上的所有定时器
     * @param target 定时器目标
     */
    static unscheduleAll(target: IScheduleBase): void {
        let scheduleHandles = this._scheduleMap.get(target);
        if (scheduleHandles) {
            let current = scheduleHandles.first;
            let next: LinkedListNode<ScheduleInfo> | null = null;
            while (current) {
                next = current.next;
                ReferencePool.release(current.value);
                this._scheduleHandlers.remove(current);
                current = next;
            }

            scheduleHandles.clear();
        }
    }

    /**
     * 轮询定时器
     * @param elapseSeconds 逻辑流逝时间
     */
    static update(elapseSeconds: number): void {
        this.internalUpdate(elapseSeconds);
    }

    /**
     * 内部轮询定时器
     * @param elapseSeconds 逻辑流逝时间
     */
    private static internalUpdate(elapseSeconds: number): void {
        if (this._scheduleHandlers.size > 0) {
            let current: LinkedListNode<ScheduleInfo> | null = this._scheduleHandlers.first;
            let next: LinkedListNode<ScheduleInfo> | null = null;
            let value: any = null;
            while (current) {
                value = current.value;
                value.update(elapseSeconds);
                if (value.isStoped()) {
                    next = current.next;
                    ReferencePool.release(value);
                    this._scheduleHandlers.remove(current);
                    this._scheduleMap.delete(value.target, value);
                    current = next;
                } else {
                    current = current.next;
                }
            }
        }

        if (this._updateMap.size > 0) {
            for (let scheduleBase of this._updateMap) {
                scheduleBase.update(elapseSeconds);
            }
        }
    }
}
