import { EventHandler } from "../../Base/EventPool/EventHandler";
import { ModelEventArgs } from "./ModelEventArgs";

/**
 * 模型接口
 */
export interface IModel {
    /**
     * 保存对象
     */
    readonly saveObject: object;
    /**
     * 查询事件是否已经被订阅
     * @param id 事件id
     * @param eventHandler 事件回调函数
     * @param thisArg this参数
     * @returns 事件是否已经被订阅
     */
    check<T extends ModelEventArgs>(id: number, eventHandler: EventHandler<T>, thisArg?: any): boolean;

    /**
     * 订阅事件
     * @param id 事件id
     * @param eventHandler 事件回调函数
     * @param thisArg this参数
     */
    subscribe<T extends ModelEventArgs>(id: number, eventHandler: EventHandler<T>, thisArg?: any): void;

    /**
     * 取消订阅事件
     * @param id 事件id
     * @param eventHandler 事件回调函数
     * @param thisArg this参数
     */
    unsubscribe<T extends ModelEventArgs>(id: number, eventHandler: EventHandler<T>, thisArg?: any): void;

    /**
     * 取消订阅者的所有订阅
     * @param target 订阅者
     */
    unsubscribeTarget(target: object): void;

    /**
     * 轮询队列发送事件
     * @param event 事件参数
     */
    fire(event: ModelEventArgs): void;

    /**
     * 立刻发送事件
     * @param event 事件参数
     */
    fireNow(event: ModelEventArgs): void;

    /**
     * 存储模型本地数据
     */
    save(): void;

    /**
     * 加载外部数据(本地或者网络数据)
     * @param data 本地或者网络数据
     */
    LoadExternalData(data: object | null): void;
}
