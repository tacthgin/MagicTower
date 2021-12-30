import { ObjectInfo } from "./ObjectInfo";

/**
 * 对象池基类
 */
export abstract class ObjectPoolBase {
    protected _name: string = "";
    protected _allowMultiSpawn: boolean = false;
    /**
     * 对象池名字
     */
    abstract get name(): string;

    /**
     * 当前对象池元素数量
     */
    abstract get count(): number;

    /**
     * 设置对象池容量
     */
    abstract set capacity(value: number);

    /**
     * 对象池容量
     */
    abstract get capacity(): number;

    /**
     *  设置对象池自动释放可释放对象的间隔秒数。
     */
    abstract set autoReleaseInterval(value: number);

    /**
     *  获取对象池自动释放可释放对象的间隔秒数。
     */
    abstract get autoReleaseInterval(): number;

    /**
     *  设置对象池过期时间。
     */
    abstract set expireTime(value: number);

    /**
     *  获取对象池过期时间。
     */
    abstract get expireTime();

    /**
     *  设置对象池的优先级。
     */
    abstract set priority(value: number);

    /**
     *  获取对象池的优先级。
     */
    abstract get priority();

    /**
     * 释放对象池中的可释放对象。
     */
    abstract release(): void;

    /**
     * 释放对象池中的所有未使用的对象
     */
    abstract releaseAllUnused(): void;

    /**
     * 获取对象池中所有对象信息
     */
    abstract GetAllObjectInfos(): ObjectInfo[];

    /**
     * 更新对象池
     * @param elapseSeconds 逻辑流逝时间
     */
    abstract update(elapseSeconds: number): void;

    /**
     * 清理对象池
     */
    abstract shutDown(): void;
}
