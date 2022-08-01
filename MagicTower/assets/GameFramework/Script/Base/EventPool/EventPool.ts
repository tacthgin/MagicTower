import { GameFrameworkMap } from "../Container/GameFrameworkMap";
import { GameFrameworkQueue } from "../Container/GameFrameworkQueue";
import { GameFrameworkError } from "../GameFrameworkError";
import { ReferencePool } from "../ReferencePool/ReferencePool";
import { BaseEventArgs } from "./BaseEventArgs";
import { Event } from "./Event";
import { EventHandler, EventHandlerTarget } from "./EventHandler";
import { EventPoolMode } from "./EventPoolMode";

/**
 * 事件池，目前只适用于单线程中
 */
export class EventPool<T extends BaseEventArgs> {
    private readonly _eventHandlerTargets: GameFrameworkMap<number, EventHandlerTarget<T>> = null!;
    private readonly _targetHandlers: GameFrameworkMap<object, EventHandlerTarget<T>> = null!;
    private readonly _events: GameFrameworkQueue<Event<T>> = null!;
    private readonly _eventPoolMode: EventPoolMode = EventPoolMode.DEFAULT;

    constructor(mode: EventPoolMode = EventPoolMode.DEFAULT) {
        this._eventHandlerTargets = new GameFrameworkMap<number, EventHandlerTarget<T>>();
        this._targetHandlers = new GameFrameworkMap<object, EventHandlerTarget<T>>();
        this._events = new GameFrameworkQueue<Event<T>>();
        this._eventPoolMode = mode;
    }

    /**
     * 轮询事件池
     * @param elapseSeconds 逻辑流逝时间
     */
    update(elapseSeconds: number): void {
        if (this._events.size > 0) {
            let event: Event<T> = this._events.pop()!;
            this.handleEvent(event.sender, event.eventArgs);
            ReferencePool.release(event);
        }
    }

    /**
     * 关闭清理事件池
     */
    shutDown() {
        this._eventHandlerTargets.clear();
        this._targetHandlers.clear();
        this._events.clear();
        this._events.clearCacheNodes();
    }

    /**
     * 清理事件
     */
    clear() {
        this._events.clear();
    }

    /**
     * 事件是否已经注册
     * @param id 事件id
     * @param eventHandler 事件句柄
     * @param thisArg 函数this指针
     * @returns 事件是否已经注册
     */
    check(id: number, eventHandler: EventHandler<T>, thisArg?: any): boolean {
        if (!eventHandler) {
            throw new GameFrameworkError("eventHandler is invalid");
        }

        return this.findEventHandlerTarget(id, eventHandler, thisArg) !== null;
    }

    /**
     * 订阅事件
     * @param id 事件id
     * @param eventHandler 事件句柄
     * @param thisArg 函数this指针
     */
    subscribe(id: number, eventHandler: EventHandler<T>, thisArg?: any): void {
        if (!eventHandler) {
            throw new GameFrameworkError("eventHandler is invalid");
        }

        let eventHandlerTargetList = this._eventHandlerTargets.get(id);
        if (eventHandlerTargetList && eventHandlerTargetList.size > 0) {
            if ((this._eventPoolMode & EventPoolMode.ALLOW_MULTI_HANDLER) != EventPoolMode.ALLOW_MULTI_HANDLER) {
                throw new GameFrameworkError(`event ${id} not allow multi handler`);
            } else if ((this._eventPoolMode & EventPoolMode.ALLOW_DUPLICATE_HANDLER) != EventPoolMode.ALLOW_DUPLICATE_HANDLER && this.check(id, eventHandler, thisArg)) {
                throw new GameFrameworkError(`event ${id} not allow duplicate handler`);
            }
        }

        let eventHandleTarget = EventHandlerTarget.create(id, thisArg, eventHandler);
        this._eventHandlerTargets.set(id, eventHandleTarget);

        if (thisArg) {
            this._targetHandlers.set(thisArg, eventHandleTarget);
        }
    }

    /**
     * 取消订阅事件
     * @param id 事件id
     * @param eventHandler 事件句柄
     * @param thisArg 函数this指针
     */
    unsubscribe(id: number, eventHandler: EventHandler<T>, thisArg?: any): void {
        if (!eventHandler) {
            throw new GameFrameworkError("eventHandler is invalid");
        }

        let eventHandlerTarget = this.findEventHandlerTarget(id, eventHandler, thisArg);
        if (eventHandlerTarget) {
            let eventHandlerTargetList = this._eventHandlerTargets.get(id)!;
            eventHandlerTargetList.remove(eventHandlerTarget);
            this._targetHandlers.delete(eventHandlerTarget.target, eventHandlerTarget);
            this.releaseEventHandlerTarget(eventHandlerTarget);
        }
    }

    /**
     * 取消订阅目标上的所有事件
     * @param target 订阅者
     */
    unsubscribeTarget(target: object): void {
        let eventHandlerTargetList = this._targetHandlers.get(target);
        if (eventHandlerTargetList) {
            for (let eventHandlerTarget of eventHandlerTargetList) {
                this._eventHandlerTargets.delete(eventHandlerTarget.id, eventHandlerTarget);
                this.releaseEventHandlerTarget(eventHandlerTarget);
            }
            this._targetHandlers.delete(target);
        }
    }

    /**
     * 延迟一帧发送事件
     * @param sender 事件宿主
     * @param eventArgs 事件参数
     */
    fire(sender: object, eventArgs: T): void {
        if (!eventArgs) {
            throw new GameFrameworkError("event args is invalid");
        }
        let event = Event.create(sender, eventArgs);
        this._events.push(event);
    }

    /**
     * 立刻发送事件
     * @param sender 事件宿主
     * @param eventArgs 事件参数
     */
    fireNow(sender: object, eventArgs: T): void {
        if (!eventArgs) {
            throw new GameFrameworkError("event args is invalid");
        }
        this.handleEvent(sender, eventArgs);
    }

    /**
     * 执行事件
     * @param sender 事件宿主
     * @param eventArgs 事件参数
     */
    private handleEvent(sender: object, eventArgs: T): void {
        let eventHandlerTargetList = this._eventHandlerTargets.get(eventArgs.id);
        if (eventHandlerTargetList) {
            for (let eventHandlerTarget of eventHandlerTargetList) {
                eventHandlerTarget.handler.call(eventHandlerTarget.target, sender, eventArgs);
            }
        }

        ReferencePool.release(eventArgs);
    }

    /**
     * 查找符合的事件目标
     * @param id 事件id
     * @param eventHandler 事件处理函数
     * @param thisArg 函数this指针
     * @returns 查找符合的事件目标
     */
    private findEventHandlerTarget(id: number, eventHandler: EventHandler<T>, thisArg?: any): EventHandlerTarget<T> | null {
        let eventHandlerTargetList = this._eventHandlerTargets.get(id);
        if (eventHandlerTargetList) {
            let node = eventHandlerTargetList.find((eventTargetHandle: EventHandlerTarget<T>) => {
                return eventTargetHandle.handler === eventHandler && eventTargetHandle.target === thisArg;
            });

            return node?.value || null;
        }

        return null;
    }

    private releaseEventHandlerTarget(eventHandleTarget: EventHandlerTarget<T>): void {
        ReferencePool.release(eventHandleTarget);
    }
}
