import { ObjectBase } from "./ObjectBase";

export interface IObjectPool<T extends ObjectBase> {
    /**
     * 对象池名字
     */
    readonly name: string;

    /**
     * 当前对象池元素数量
     */
    readonly count: number;

    /**
     * 设置或者获取对象池容量
     */
    capacity: number;

    /**
     *  设置或者获取对象池自动释放可释放对象的间隔秒数。
     */
    autoReleaseInterval: number;

    /**
     *  设置或者获取对象池过期时间。
     */
    expireTime: number;

    /**
     *  设置或者获取对象池的优先级。
     */
    priority: number;

    /**
     *  设置对象池中对象优先级
     */
    setPriority(targetOrObject: object | T, priority: number): void;

    /**
     *  锁定对象池中对象
     */
    setLocked(targetOrObject: object | T, locked: boolean): void;

    /**
     * 创建对象
     * @param obj 对象
     * @param spawned 对象是否已被获取
     */
    register(obj: T, spawned: boolean): void;

    /**
     * 是否可以获取对象
     */
    canSpawn(name?: string): boolean;

    /**
     * 获取对象
     */
    spawn(name?: string): T | null;

    /**
     * 回收对象
     * @param objectOrTarget
     */
    upspawn(objectOrTarget: T | object): void;

    /**
     * 释放对象。
     */
    releaseObject(objectOrTarget: T | object): boolean;

    /**
     * 释放对象池中的可释放对象。
     */
    release(): void;

    /**
     * 释放对象池中的所有未使用的对象
     */
    releaseAllUnused(): void;
}
