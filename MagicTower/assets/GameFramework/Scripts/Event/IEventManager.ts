import { EventHandle } from "../Base/EventPool/EventHandle";
import { GameEventArgs } from "./GameEventArgs";

export interface IEventManager {
    /**
     * 清除事件
     */
    clear(): void;

    /**
     * 订阅事件处理函数
     * @param id 事件id
     * @param eventHandle 事件处理函数
     * @param thisArg 传递的this指针
     */
    subscribe(id: number, eventHandle: EventHandle<GameEventArgs>, thisArg?: any): void;

    /**
     * 取消订阅事件处理函数
     * @param id 事件id
     * @param eventHandle 事件处理函数
     * @param thisArg 传递的this指针
     */
    unsubscribe(id: number, eventHandle: EventHandle<GameEventArgs>, thisArg?: any): void;

    /**
     * 取消订阅该目标下的所有事件处理函数
     * @param target 目标
     */
    unsubscribeTarget(target: object): void;

    /**
     * 检查该事件id是否有事件处理函数
     * @param id 事件id
     * @param eventHandle 事件处理函数
     * @param thisArg 传递的this指针
     */
    check(id: number, eventHandle: EventHandle<GameEventArgs>, thisArg?: any): boolean;

    /**
     * 每帧分发事件
     * @param sender 事件源
     * @param e 事件参数
     */
    fire(sender: object, e: GameEventArgs): void;

    /**
     * 立刻分发事件
     * @param sender 事件源
     * @param e 事件参数
     */
    fireNow(sender: object, e: GameEventArgs): void;
}
