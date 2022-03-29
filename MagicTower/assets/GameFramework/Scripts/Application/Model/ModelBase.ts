import { EventHandle } from "../../Base/EventPool/EventHandle";
import { EventPool } from "../../Base/EventPool/EventPool";
import { GameFrameworkError } from "../../Base/GameFrameworkError";
import { GameFrameworkLog } from "../../Base/Log/GameFrameworkLog";
import { ISaveManager } from "../../Save/ISaveManager";
import { ScheduleBase } from "../Base/ScheduleBase";
import { IModel } from "./IModel";
import { ModelEventArgs } from "./ModelEventArgs";

/**
 * 模型基类
 */
export abstract class ModelBase extends ScheduleBase implements IModel {
    private readonly _eventPool: EventPool<ModelEventArgs> = null!;
    private _saveManager: ISaveManager | null = null;
    private _saveObject: any = {};
    private _saveName: string = "";

    constructor() {
        super();
        this._eventPool = new EventPool<ModelEventArgs>();
    }

    /**
     * 模型优先级
     */
    get priority(): number {
        return 0;
    }

    /**
     * 轮询模型
     * @param elapseSeconds 逻辑流逝事件
     */
    update(elapseSeconds: number) {
        super.update(elapseSeconds);
        this._eventPool.update(elapseSeconds);
    }

    /**
     * 关闭并清理模型
     */
    shutDown() {
        super.shutDown();
        this._eventPool.shutDown();
    }

    /**
     * 设置存储管理器
     * @param saveManager 存储管理器
     * @param saveName 模型存储名字
     */
    setSaveManager(saveManager: ISaveManager, saveName: string): void {
        this._saveManager = saveManager;
        this._saveName = saveName;
    }

    check<T extends ModelEventArgs>(id: number, eventHandle: EventHandle<T>, thisArg?: any): boolean {
        return this._eventPool.check(id, eventHandle as EventHandle<ModelEventArgs>, thisArg);
    }

    subscribe<T extends ModelEventArgs>(id: number, eventHandle: EventHandle<T>, thisArg?: any): void {
        this._eventPool.subscribe(id, eventHandle as EventHandle<ModelEventArgs>, thisArg);
    }

    unsubscribe<T extends ModelEventArgs>(id: number, eventHandle: EventHandle<T>, thisArg?: any): void {
        this._eventPool.unsubscribe(id, eventHandle as EventHandle<ModelEventArgs>, thisArg);
    }

    unsubscribeTarget(target: object): void {
        this._eventPool.unsubscribeTarget(target);
    }

    fire(event: ModelEventArgs) {
        this._eventPool.fire(this, event);
    }

    fireNow(event: ModelEventArgs) {
        this._eventPool.fireNow(this, event);
    }

    /**
     * 加载模型数据
     * @param localData 模型数据
     */
    abstract load(localData: object | null): void;

    /**
     * 存储模型本地数据
     */
    save(): void {
        if (!this._saveManager) {
            throw new GameFrameworkError("you must set save manager first");
        }
        if (this._saveObject) {
            this._saveManager.setObject(this._saveName, this._saveObject);
        } else {
            GameFrameworkLog.error(`you must set model ${this._saveName} save object first`);
        }
    }

    addSaveKey(name: string) {
        if (name in this) {
            this._saveObject[name] = (this as any)[name];
        }
    }

    /**
     * 按键值赋予模型数据
     * @param data 数据
     */
    protected loadData(data: object): void {
        for (let key in data) {
            let thisInfo = this as any;
            if (thisInfo[key] !== undefined) {
                thisInfo[key] = (data as any)[key];
            }
        }
    }

    /**
     * 保存标志装饰器
     * @returns 装饰器函数
     */
    static saveMark(...args: any[]) {
        console.log(args);
    }
}
