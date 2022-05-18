import { Constructor } from "../../Base/DataStruct/Constructor";
import { IObejctPoolManager } from "../../ObjectPool/IObejctPoolManager";
import { CommandBase } from "./CommandBase";
import { SystemBase } from "./SystemBase";

/**
 * 命令、系统管理器接口
 */
export interface ICommandManager {
    /**
     * 设置或者获取命令对象池自动释放间隔
     */
    commandAutoRelaseInterval: number;

    /**
     * 设置或者获取命令对象池容量
     */
    commandCapacity: number;

    /**
     * 设置或者获取命令对象池过期时间
     */
    commandExpireTime: number;

    /**
     * 设置或者获取命令对象池优先级
     */
    commandPriority: number;

    /**
     * 设置或者获取系统对象池自动释放间隔
     */
    systemAutoRelaseInterval: number;

    /**
     * 设置或者获取系统对象池容量
     */
    systemCapacity: number;

    /**
     * 设置或者获取系统对象池过期时间
     */
    systemExpireTime: number;

    /**
     * 设置或者获取系统对象池优先级
     */
    systemPriority: number;

    /**
     * 设置对象池管理器
     * @param objectPoolManager 对象池管理器
     */
    setObjectPoolManager(objectPoolManager: IObejctPoolManager): void;

    /**
     * 根据命令构造器获取命令
     * @param commandConstructor 命令构造器
     * @returns 命令
     */
    createCommand<T extends CommandBase>(commandConstructor: Constructor<T>): T;

    /**
     * 清理命令
     * @param command 命令
     */
    destroyCommand<T extends CommandBase>(command: T): void;

    /**
     * 根据系统构造器获取系统
     * @param systemConstructor 系统构造器
     * @returns 系统
     */
    createSystem<T extends SystemBase>(systemConstructor: Constructor<T>): T;

    /**
     * 清理系统
     * @param system 系统
     */
    destroySystem<T extends SystemBase>(system: T): void;

    /**
     * 根据系统构造器获取唯一实例系统
     * @param systemConstructor 系统构造器
     * @returns 唯一实例系统
     */
    createUniqueSystem<T extends SystemBase>(systemConstructor: Constructor<T>): T;

    /**
     * 清理唯一实例系统
     * @param system 系统
     * @returns 删除唯一实例系统是否成功
     */
    destroyUniqueSystem<T extends SystemBase>(systemConstructor: Constructor<T>): boolean;
}
