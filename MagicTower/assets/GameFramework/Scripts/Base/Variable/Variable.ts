import { IRerference } from "../ReferencePool/IRerference";
import { ReferencePool } from "../ReferencePool/ReferencePool";

export class Variable<T> implements IRerference {
    private _value: T | null = null;

    set value(value: T) {
        this._value = value;
    }

    get value(): T {
        return this._value!;
    }

    static create<T>(value: T): Variable<T> {
        let variable = ReferencePool.acquire<Variable<T>>(Variable);
        variable.value = value;
        return variable;
    }

    clear(): void {
        this._value = null;
    }
}
