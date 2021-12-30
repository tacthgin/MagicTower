import { GameFrameworkError } from "../Base/GameFrameworkError";
import { IRerference } from "../Base/ReferencePool/IRerference";
import { ReferencePool } from "../Base/ReferencePool/ReferencePool";
import { ObjectBase } from "./ObjectBase";

export class FObject<T extends ObjectBase> implements IRerference {
    private _object: T | null = null;
    private _spawnCount: number = 0;

    get name(): string {
        return this._object!.name;
    }

    set locked(value: boolean) {
        this._object!.locked = value;
    }

    get locked(): boolean {
        return this._object!.locked;
    }

    set priority(value: number) {
        this._object!.priority = value;
    }

    get priority(): number {
        return this._object!.priority;
    }

    get lastUseTime(): number {
        return this._object!.lastUseTime;
    }

    get customCanReleaseFlag(): boolean {
        return this._object!.customCanReleaseFlag;
    }

    get isInUse(): boolean {
        return this._spawnCount > 0;
    }

    get spawnCount(): number {
        return this._spawnCount;
    }

    static create<T extends ObjectBase>(obj: T, spawned: boolean): FObject<T> {
        if (!obj) {
            throw new GameFrameworkError("object is invalid");
        }

        let internalObject: FObject<T> = ReferencePool.acquire<FObject<T>>(FObject);
        internalObject._object = obj;
        internalObject._spawnCount = spawned ? 1 : 0;
        if (spawned) {
            obj.onSpawn();
        }
        return internalObject;
    }

    clear(): void {
        this._object = null;
        this._spawnCount = 0;
    }

    peek(): T {
        return this._object!;
    }

    spawn(): T {
        ++this._spawnCount;
        this._object!.lastUseTime = Date.now();
        this._object?.onSpawn();
        return this._object!;
    }

    unspawn(): void {
        --this._spawnCount;
        this._object!.lastUseTime = Date.now();
        this._object?.onUnspawn();
        if (this._spawnCount < 0) {
            throw new GameFrameworkError(`object ${this.name} spawn count is less than 0`);
        }
    }

    release(isShutdown: boolean): void {
        this._object?.release(isShutdown);
        ReferencePool.release(this._object!);
    }
}
