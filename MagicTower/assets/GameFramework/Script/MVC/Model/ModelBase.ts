import { Constructor } from "../../Base/DataStruct/Constructor";
import { EventHandler } from "../../Base/EventPool/EventHandler";
import { EventPool } from "../../Base/EventPool/EventPool";
import { EventPoolMode } from "../../Base/EventPool/EventPoolMode";
import { GameFrameworkError } from "../../Base/GameFrameworkError";
import { ISaveManager } from "../../Save/ISaveManager";
import { ScheduleBase } from "../Schedule/ScheduleBase";
import { IModel } from "./IModel";
import { ModelEventArgs } from "./ModelEventArgs";

/**
 * 模型基类
 */
export abstract class ModelBase extends ScheduleBase implements IModel {
    private static readonly s_saveKeys: Map<Constructor<ModelBase>, Array<string>> = new Map<Constructor<ModelBase>, Array<string>>();
    private readonly _eventPool: EventPool<ModelEventArgs> = null!;
    /** 存储管理器 */
    private _saveManager: ISaveManager | null = null;
    /** 保存对象，通过存储属性装饰器保存要存的键名 */
    private readonly _saveObject: any = {};
    /** 模型保存的名字 */
    private _saveName: string = "";
    /** 赋值变量的时候，是否自动保存 */
    private _autoSave: boolean = false;

    constructor() {
        super();
        this._eventPool = new EventPool<ModelEventArgs>(EventPoolMode.ALLOW_MULTI_HANDLER);
    }

    /**
     * 模型优先级
     */
    get priority(): number {
        return 0;
    }

    /**
     * 保存对象
     */
    get saveObject(): Readonly<object> {
        return this._saveObject;
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

    check<T extends ModelEventArgs>(id: number, eventHandle: EventHandler<T>, thisArg?: any): boolean {
        return this._eventPool.check(id, eventHandle as EventHandler<ModelEventArgs>, thisArg);
    }

    subscribe<T extends ModelEventArgs>(id: number, eventHandle: EventHandler<T>, thisArg?: any): void {
        this._eventPool.subscribe(id, eventHandle as EventHandler<ModelEventArgs>, thisArg);
    }

    unsubscribe<T extends ModelEventArgs>(id: number, eventHandle: EventHandler<T>, thisArg?: any): void {
        this._eventPool.unsubscribe(id, eventHandle as EventHandler<ModelEventArgs>, thisArg);
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
     * 存储模型本地数据
     */
    save(): void {
        if (!this._saveManager) {
            throw new GameFrameworkError("you must set save manager first");
        }

        this._saveManager.setObject(this._saveName, this._saveObject);
    }

    /**
     * 定义保存标志的属性
     */
    defineSaveProperty(): void {
        let keys = ModelBase.s_saveKeys.get(this.constructor as any);
        if (!keys) return;
        keys.forEach((key) => {
            this._saveObject[key] = (this as any)[key];
            Reflect.defineProperty(this, key, {
                configurable: true,
                enumerable: true,
                set: (value: any) => {
                    let oldValue = this._saveObject[key];
                    if (oldValue !== value) {
                        this._saveObject[key] = value;
                        if (this._autoSave) {
                            this.save();
                        }
                    }
                },
                get: () => {
                    return this._saveObject[key];
                },
            });
        });
    }

    /**
     * 加载外部数据(本地或者网络数据)
     * @param data 本地或者网络数据
     */
    LoadExternalData(data: object | null) {
        let oldValue = this._autoSave;
        this._autoSave = false;
        this.onLoad(data);
        this._autoSave = oldValue;
    }

    /**
     * 加载本地或者网络数据回调
     * @param data 本地或者网络数据
     */
    protected abstract onLoad(data: object | null): void;

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
     * 是否开启自动保存
     * @param autoSave 自动保存
     */
    protected setAutoSave(autoSave: boolean) {
        this._autoSave = autoSave;
    }

    /**
     * 模型变量保存属性装饰器
     * @param target
     * @param key
     */
    protected static saveMark(target: ModelBase, key: string) {
        let constructor: any = target.constructor;
        let keys = ModelBase.s_saveKeys.get(constructor);
        if (!keys) {
            keys = new Array<string>();
            ModelBase.s_saveKeys.set(constructor, keys);
        }
        keys.push(key);
    }
}
