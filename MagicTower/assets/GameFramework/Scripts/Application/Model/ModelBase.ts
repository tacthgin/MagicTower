import { EventHandle } from "../../Base/EventPool/EventHandle";
import { EventPool } from "../../Base/EventPool/EventPool";
import { GameFrameworkError } from "../../Base/GameFrameworkError";
import { ISaveManager } from "../../Save/ISaveManager";
import { ScheduleBase } from "../Base/ScheduleBase";
import { IModel } from "./IModel";
import { ModelContainer } from "./ModelContainer";
import { ModelEventArgs } from "./ModelEventArgs";

export abstract class ModelBase extends ScheduleBase implements IModel {
    private _saveManager: ISaveManager | null = null;
    private _eventPool: EventPool<ModelEventArgs> = null!;

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
        super.clear();
        this._eventPool.shutDown();
    }

    /**
     * 设置存储管理器
     * @param saveManager 存储管理器
     */
    setSaveManager(saveManager: ISaveManager): void {
        this._saveManager = saveManager;
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
     * 加载模型本地数据
     * @param localData 模型本地数据
     */
    abstract load(localData: object | null): void;

    /**
     * 存储模型本地数据
     */
    save(): void {
        if (!this._saveManager) {
            throw new GameFrameworkError("you must set save manager first");
        }
        this._saveManager.setObject(ModelContainer.getClassName(this), this);
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
}
