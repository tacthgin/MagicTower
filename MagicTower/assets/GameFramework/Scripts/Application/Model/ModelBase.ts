import { EventHandle } from "../../Base/EventPool/EventHandle";
import { EventPool } from "../../Base/EventPool/EventPool";
import { ISaveManager } from "../../Save/ISaveManager";
import { IModel } from "./IModel";
import { ModelEventArgs } from "./ModelEventArgs";

export abstract class ModelBase implements IModel {
    private _saveManager: ISaveManager | null = null;
    private _eventPool: EventPool<ModelEventArgs> = null!;

    constructor() {
        this._eventPool = new EventPool<ModelEventArgs>();
    }

    get priority(): number {
        return 0;
    }

    update(elapseSeconds: number) {
        this._eventPool.update(elapseSeconds);
    }

    shutDown() {
        this._eventPool.shutDown();
    }

    setSaveManager(saveManager: ISaveManager): void {
        this._saveManager = saveManager;
    }

    check(id: number, eventHandle: EventHandle<ModelEventArgs>, thisArg?: any): boolean {
        return this._eventPool.check(id, eventHandle, thisArg);
    }

    subscribe(id: number, eventHandle: EventHandle<ModelEventArgs>, thisArg?: any): void {
        this._eventPool.subscribe(id, eventHandle, thisArg);
    }

    unsubscribe(id: number, eventHandle: EventHandle<ModelEventArgs>, thisArg?: any): void {
        this._eventPool.unsubscribe(id, eventHandle, thisArg);
    }

    unsubscribeTarget(target: object): void {
        this._eventPool.unsubscribeTarget(target);
    }

    save(): void {}

    load(localData: string): void {}
}
