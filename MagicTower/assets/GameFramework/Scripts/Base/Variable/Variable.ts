import { IRerference } from "../ReferencePool/IRerference";

export abstract class Variable<T> implements IRerference {
    private _value: T | null = null;

    set value(value: T) {
        this._value = value;
    }

    get value(): T {
        return this._value!;
    }

    clear(): void {
        this._value = null;
    }
}
