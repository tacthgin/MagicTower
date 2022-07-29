import { Constructor } from "./Constructor";

export class ConstructorNamePair<T> {
    private readonly _consturctor: Constructor<T> = null!;
    private readonly _name: string = "";

    constructor(consturctor: Constructor<T>, name?: string) {
        this._consturctor = consturctor;
        this._name = name || "";
    }

    get typeConstructor() {
        return this._consturctor;
    }

    get name() {
        return this._name;
    }

    equals(consturctor: Constructor<T>, name?: string) {
        name = name || "";
        return this._consturctor == consturctor && this._name == name;
    }
}
