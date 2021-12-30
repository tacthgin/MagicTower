export class ObjectInfo {
    private _name: string = "";
    private _locked: boolean = false;
    private _customCanReleaseFlag: boolean = true;
    private _priority: number = 0;
    private _lastUseTime: number = 0;
    private _spawnCount: number = 0;

    constructor(name: string, locked: boolean, customCanReleaseFlag: boolean, priority: number, lastUseTime: number, spawnCount: number) {
        this._name = name;
        this._locked = locked;
        this._customCanReleaseFlag = customCanReleaseFlag;
        this._priority = priority;
        this._lastUseTime = lastUseTime;
        this._spawnCount = spawnCount;
    }

    get name(): string {
        return this._name;
    }

    get locked(): boolean {
        return this._locked;
    }

    get priority(): number {
        return this._priority;
    }

    get customCanReleaseFlag(): boolean {
        return this._customCanReleaseFlag;
    }

    get lastUseTime(): number {
        return this._lastUseTime;
    }

    get spawnCount(): number {
        return this._spawnCount;
    }
}
