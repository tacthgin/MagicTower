import { IRerference } from "../../../../../GameFramework/Script/Base/ReferencePool/IRerference";
import { LoadBase } from "../../../../../GameFramework/Script/MVC/Model/LoadBase";

export class Element extends LoadBase implements IRerference {
    private _gid: number = 0;
    protected _id: number = 0;
    private _index: number = -1;
    private _hide: boolean = false;

    set gid(value: number) {
        this._gid = value;
    }

    /** tile唯一id */
    get gid(): number {
        return this._gid;
    }

    set id(value: number) {
        this._id = value;
    }

    /** 唯一id */
    get id(): number {
        return this._id;
    }

    set index(value: number) {
        this._index = value;
    }

    /** tile index */
    get index(): number {
        return this._index;
    }

    set hide(value: boolean) {
        this._hide = value;
    }

    /** is hide */
    get hide(): boolean {
        return this._hide;
    }

    clear(): void {
        this._gid = 0;
        this._id = 0;
        this._index = -1;
    }

    load(info: any) {
        this.loadData(info);
        return this;
    }
}
