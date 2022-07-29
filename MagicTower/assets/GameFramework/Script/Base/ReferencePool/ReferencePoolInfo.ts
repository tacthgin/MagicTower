import { IRerference } from "./IRerference";
import { ReferenceConstructor } from "./ReferenceConstructor";

export class ReferencePoolInfo {
    private _referenceConstructor: ReferenceConstructor<IRerference> = null!;
    private _addReferenceCount: number = 0;
    private _removeReferenceCount: number = 0;
    private _acquireReferenceCount: number = 0;
    private _usingRerferenceCount: number = 0;
    private _releaseRerferenceCount: number = 0;

    constructor(
        referenceConstructor: ReferenceConstructor<IRerference>,
        addReferenceCount: number,
        removeReferenceCount: number,
        acquireReferenceCount: number,
        usingRerferenceCount: number,
        releaseRerferenceCount: number
    ) {
        this._referenceConstructor = referenceConstructor;
        this._addReferenceCount = addReferenceCount;
        this._removeReferenceCount = removeReferenceCount;
        this._acquireReferenceCount = acquireReferenceCount;
        this._usingRerferenceCount = usingRerferenceCount;
        this._releaseRerferenceCount = releaseRerferenceCount;
    }

    get referenceConstructor(): ReferenceConstructor<IRerference> {
        return this._referenceConstructor;
    }

    get addReferenceCount(): number {
        return this._addReferenceCount;
    }

    get removeReferenceCount(): number {
        return this._removeReferenceCount;
    }

    get acquireReferenceCount(): number {
        return this._acquireReferenceCount;
    }

    get usingRerferenceCount(): number {
        return this._usingRerferenceCount;
    }

    get releaseRerferenceCount(): number {
        return this._releaseRerferenceCount;
    }
}
