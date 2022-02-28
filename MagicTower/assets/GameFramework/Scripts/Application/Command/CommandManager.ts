import { Constructor } from "../../Base/DataStruct/Constructor";
import { GameFrameworkError } from "../../Base/GameFrameworkError";
import { GameFrameworkLinkedList } from "../../Base/GameFrameworkLinkedList";
import { ReferencePool } from "../../Base/ReferencePool/ReferencePool";
import { IObejctPoolManager } from "../../ObjectPool/IObejctPoolManager";
import { IObjectPool } from "../../ObjectPool/IObjectPool";
import { CommandBase } from "./CommandBase";
import { CommandObject } from "./CommandObject";
import { ICommandManager } from "./ICommandManager";
import { SystemBase } from "./SystemBase";

export class CommandManager implements ICommandManager {
    private static readonly s_nameConstructors: Map<Constructor<CommandBase | SystemBase>, string> = new Map<Constructor<CommandBase | SystemBase>, string>();
    private _objectPoolManager: IObejctPoolManager | null = null;
    private _commandPool: IObjectPool<CommandObject> = null!;
    private _systemPool: IObjectPool<CommandObject> = null!;
    private _updateSystemPool: GameFrameworkLinkedList<SystemBase> = null!;

    constructor() {
        this._updateSystemPool = new GameFrameworkLinkedList<SystemBase>();
    }

    set commandAutoRelaseInterval(value: number) {
        this._commandPool.autoReleaseInterval = value;
    }

    get commandAutoRelaseInterval(): number {
        return this._commandPool.autoReleaseInterval;
    }

    set commandCapacity(value: number) {
        this._commandPool.capacity = value;
    }

    get commandCapacity(): number {
        return this._commandPool.capacity;
    }

    set commandExpireTime(value: number) {
        this._commandPool.expireTime = value;
    }

    get commandExpireTime(): number {
        return this._commandPool.expireTime;
    }

    set commandPriority(value: number) {
        this._systemPool.priority = value;
    }

    get commandPriority(): number {
        return this._systemPool.priority;
    }

    set systemAutoRelaseInterval(value: number) {
        this._systemPool.autoReleaseInterval = value;
    }

    get systemAutoRelaseInterval(): number {
        return this._systemPool.autoReleaseInterval;
    }

    set systemCapacity(value: number) {
        this._systemPool.capacity = value;
    }

    get systemCapacity(): number {
        return this._systemPool.capacity;
    }

    set systemExpireTime(value: number) {
        this._systemPool.expireTime = value;
    }

    get systemExpireTime(): number {
        return this._systemPool.expireTime;
    }

    set systemPriority(value: number) {
        this._systemPool.priority = value;
    }

    get systemPriority(): number {
        return this._systemPool.priority;
    }

    /**
     * 注册装饰函数
     * @param className 类名
     * @returns
     */
    static register(className: string): (target: Constructor<CommandBase | SystemBase>) => void {
        return (target: Constructor<CommandBase | SystemBase>) => {
            this.s_nameConstructors.set(target, className);
        };
    }

    /**
     * 轮询命令
     * @param elapseSeconds 逻辑流逝时间
     */
    update(elapseSeconds: number) {
        for (let system of this._updateSystemPool) {
            system.update(elapseSeconds);
        }
    }

    /**
     * 关闭命令管理器
     */
    shutDown() {
        this._updateSystemPool.clear();
    }

    setObjectPoolManager(objectPoolManager: IObejctPoolManager): void {
        this._objectPoolManager = objectPoolManager;
        this._commandPool = this._objectPoolManager.createSingleSpawnObjectPool(CommandObject, "command pool");
        this._systemPool = this._objectPoolManager.createSingleSpawnObjectPool(CommandObject, "system pool");
    }

    createCommand<T extends CommandBase>(commandConstructor: Constructor<T>): T {
        if (!this._objectPoolManager) {
            throw new GameFrameworkError("you must set object pool manager first");
        }

        let name = CommandManager.s_nameConstructors.get(commandConstructor);
        if (!name) {
            throw new GameFrameworkError(`command does not reigster`);
        }

        let commandObject: CommandObject | null = this._commandPool.spawn(name);
        if (!commandObject) {
            commandObject = CommandObject.create(name, ReferencePool.acquire(commandConstructor));
            this._commandPool.register(commandObject, true);
        }

        return commandObject.target as T;
    }

    destroyCommand<T extends CommandBase>(command: T): void {
        this._commandPool.upspawn(command);
    }

    createSystem<T extends SystemBase>(systemConstructor: Constructor<T>): T {
        if (!this._objectPoolManager) {
            throw new GameFrameworkError("you must set object pool manager first");
        }

        let name = CommandManager.s_nameConstructors.get(systemConstructor);
        if (!name) {
            throw new GameFrameworkError(`system does not reigster`);
        }

        let commandObject: CommandObject | null = this._systemPool.spawn(name);
        let system: T | null = null;
        if (!commandObject) {
            system = ReferencePool.acquire(systemConstructor);
            commandObject = CommandObject.create(name, system);
            this._systemPool.register(commandObject, true);
        } else {
            system = commandObject.target as T;
        }

        this._updateSystemPool.addLast(system);
        system.awake();

        return system;
    }

    destroySystem<T extends SystemBase>(system: T): void {
        system.shutDown();
        this._systemPool.upspawn(system);
        this._updateSystemPool.remove(system);
    }
}
