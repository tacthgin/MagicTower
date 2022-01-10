import { LoadBase } from "../../../../../GameFramework/Scripts/Application/Model/LoadBase";

export class Element extends LoadBase {
    protected _gid: number = 0;
    protected _id: number = 0;
    protected _index: number = -1;

    set gid(value: number) {
        this._gid = value;
    }

    /** tile唯一id */
    get gid() {
        return this._gid;
    }

    set id(value: number) {
        this._id = value;
    }

    /** 唯一id */
    get id() {
        return this._id;
    }

    set index(value: number) {
        this._index = value;
    }

    /** tile index */
    get index() {
        return this._index;
    }
}


