import { Constructor } from "../Base/DataStruct/Constructor";
import { IObjectPool } from "./IObjectPool";
import { ObjectBase } from "./ObjectBase";
import { ObjectPoolBase } from "./ObjectPoolBase";

export interface IObejctPoolManager {
    readonly count: number;

    /**
     * 是否有对象池
     * @param constructor 对象构造器
     * @param name 对象名字
     */
    hasObjectPool<T extends ObjectBase>(constructor: Constructor<T>, name?: string): boolean;

    /**
     * 获取对象池
     * @param constructor 对象构造器
     * @param name 对象名字
     */
    getObjectPool<T extends ObjectBase>(constructor: Constructor<T>, name?: string): IObjectPool<T> | null;

    /**
     * 获取对象池
     * @param constructor 对象构造器
     * @param name 对象名字
     */
    getObjectPoolBase(constructor: Constructor<ObjectBase>, name?: string): ObjectPoolBase | null;

    /**
     * 获取所有对象池
     * @param sort 是否根据优先级排序
     * @param results 返回的对象池数组
     */
    getAllObjectPools(sort: boolean, results: ObjectPoolBase[]): void;

    /**
     * 创建允许单次获取的对象池
     * @param constructor 对象构造器
     * @param name 对象池名字
     * @param autoReleaseInterval 对象自动释放间隔
     * @param capacity 对象池容量
     * @param expireTime 对象池过期时间戳
     * @param priority 对象池优先级
     */
    createSingleSpawnObjectPool<T extends ObjectBase>(
        constructor: Constructor<T>,
        name: string,
        autoReleaseInterval?: number,
        capacity?: number,
        expireTime?: number,
        priority?: number
    ): IObjectPool<T>;

    /**
     * 创建允许单次获取的对象池
     * @param constructor 对象构造器
     * @param name 对象池名字
     * @param autoReleaseInterval 对象自动释放间隔
     * @param capacity 对象池容量
     * @param expireTime 对象池过期时间戳
     * @param priority 对象池优先级
     */
    createSingleSpawnObjectPoolBase(constructor: Constructor<ObjectBase>, name: string, autoReleaseInterval?: number, capacity?: number, expireTime?: number, priority?: number): ObjectPoolBase;

    /**
     * 创建允许多次获取的对象池
     * @param constructor 对象构造器
     * @param name 对象池名字
     * @param autoReleaseInterval 对象自动释放间隔
     * @param capacity 对象池容量
     * @param expireTime 对象池过期时间戳
     * @param priority 对象池优先级
     */
    CreateMultiSpawnObjectPool<T extends ObjectBase>(
        constructor: Constructor<T>,
        name: string,
        autoReleaseInterval?: number,
        capacity?: number,
        expireTime?: number,
        priority?: number
    ): IObjectPool<T>;

    /**
     * 创建允许多次获取的对象池
     * @param constructor 对象构造器
     * @param name 对象池名字
     * @param autoReleaseInterval 对象自动释放间隔
     * @param capacity 对象池容量
     * @param expireTime 对象池过期时间戳
     * @param priority 对象池优先级
     */
    CreateMultiSpawnObjectPoolBase(constructor: Constructor<ObjectBase>, name: string, autoReleaseInterval?: number, capacity?: number, expireTime?: number, priority?: number): ObjectPoolBase;

    /**
     * 释放对象池
     * @param constructor 对象构造器
     * @param name 对象名字
     */
    destroyObjectPool<T extends ObjectBase>(constructor: Constructor<T>, name?: string): boolean;

    /**
     * 释放所有对象池中可释放的对象
     */
    release(): void;

    /**
     * 释放所有对象池中未使用的对象
     */
    releaseAllUnused(): void;
}
