import { EventHandle } from "../../Base/EventPool/EventHandle";
import { ISaveManager } from "../../Save/ISaveManager";
import { ModelEventArgs } from "./ModelEventArgs";

export interface IModel {
    /**
     * 设置存储管理器
     * @param saveManager 存储管理器
     */
    setSaveManager(saveManager: ISaveManager): void;

    /**
     * 查询事件是否已经被订阅
     * @param id 事件id
     * @param eventHandle 事件回调函数
     * @param thisArg this参数
     * @returns 事件是否已经被订阅
     */
    check(id: number, eventHandle: EventHandle<ModelEventArgs>, thisArg?: any): boolean;

    /**
     * 订阅事件
     * @param id 事件id
     * @param eventHandle 事件回调函数
     * @param thisArg this参数
     */
    subscribe(id: number, eventHandle: EventHandle<ModelEventArgs>, thisArg?: any): void;

    /**
     * 取消订阅事件
     * @param id 事件id
     * @param eventHandle 事件回调函数
     * @param thisArg this参数
     */
    unsubscribe(id: number, eventHandle: EventHandle<ModelEventArgs>, thisArg?: any): void;

    /**
     * 取消订阅者的所有订阅
     * @param target 订阅者
     */
    unsubscribeTarget(target: object): void;

    /**
     * 存储模型本地数据
     */
    save(): void;
}
