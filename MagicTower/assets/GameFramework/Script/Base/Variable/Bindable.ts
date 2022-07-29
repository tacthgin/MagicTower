import { ReferencePool } from "../ReferencePool/ReferencePool";
import { Variable } from "./Variable";

export type BindableEventHandle<T> = (value: T) => void;

export class Bindable<T> extends Variable<T> {
    private _eventPool: Map<BindableEventHandle<T>, any> = null!;

    constructor() {
        super();
        this._eventPool = new Map<BindableEventHandle<T>, any>();
    }

    set value(value: T) {
        if (this.value === value) {
            return;
        }
        this.value = value;
        this.fireNow();
    }

    static create<T>(defeultValue: T | null = null): Bindable<T> {
        let bindable = ReferencePool.acquire<Bindable<T>>(Bindable);
        if (defeultValue !== null) {
            bindable.value = defeultValue;
        }
        return bindable;
    }

    check(eventHandle: BindableEventHandle<T>, thisArg?: any) {
        return this._eventPool.has(eventHandle);
    }

    subscribe(eventHandle: BindableEventHandle<T>, thisArg?: any) {
        this._eventPool.set(eventHandle, thisArg);
    }

    unsubscribe(eventHandle: BindableEventHandle<T>, thisArg?: any) {
        this._eventPool.delete(eventHandle);
    }

    private fireNow() {
        for (let pair of this._eventPool) {
            pair[0].call(pair[1], this.value);
        }
    }
}
