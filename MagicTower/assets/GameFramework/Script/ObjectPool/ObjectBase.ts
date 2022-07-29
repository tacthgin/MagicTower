import { GameFrameworkError } from "../Base/GameFrameworkError";
import { IRerference } from "../Base/ReferencePool/IRerference";

export abstract class ObjectBase implements IRerference {
    private _name: string = "";
    private _target: object | null = null;
    private _locked: boolean = false;
    private _priority: number = 0;
    private _lastUseTime: number = 0;
    private _customCanReleaseFlag: boolean = true;

    get name(): string {
        return this._name;
    }

    get target(): object {
        return this._target!;
    }

    set locked(value: boolean) {
        this._locked = value;
    }

    get locked(): boolean {
        return this._locked;
    }

    set priority(value: number) {
        this._priority = value;
    }

    get priority(): number {
        return this._priority;
    }

    set customCanReleaseFlag(value: boolean) {
        this._customCanReleaseFlag = value;
    }

    get customCanReleaseFlag(): boolean {
        return this._customCanReleaseFlag;
    }

    set lastUseTime(value: number) {
        this._lastUseTime = value;
    }

    get lastUseTime(): number {
        return this._lastUseTime;
    }

    initialize(name: string, target: object, locked: boolean = false, priority: number = 0): void {
        if (!target) {
            throw new GameFrameworkError(`${name} target not exist`);
        }
        this._name = name || "";
        this._target = target;
        this._locked = locked;
        this._priority = priority;
        this._lastUseTime = Date.now();
    }

    clear(): void {
        this._name = "";
        this._target = null;
        this._locked = false;
        this._priority = 0;
        this._lastUseTime = 0;
    }

    onSpawn(): void {}

    onUnspawn(): void {}

    release(isShutDown: boolean): void {}
}
