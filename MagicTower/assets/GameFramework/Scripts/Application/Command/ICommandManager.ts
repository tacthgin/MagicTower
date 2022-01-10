import { Constructor } from "../../Base/DataStruct/Constructor";
import { IObejctPoolManager } from "../../ObjectPool/IObejctPoolManager";
import { CommandBase } from "./CommandBase";

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
    createCommand(commandConstructor: Constructor<CommandBase>): CommandBase;

    /**
     * 根据系统构造器获取系统
     * @param systemConstructor 系统构造器
     * @returns 系统
     */
    createSystem(systemConstructor: Constructor<CommandBase>): CommandBase;
}
