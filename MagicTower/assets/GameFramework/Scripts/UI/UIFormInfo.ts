import { IRerference } from "../Base/ReferencePool/IRerference";
import { ReferencePool } from "../Base/ReferencePool/ReferencePool";
import { IUIForm } from "./IUIForm";

export class UIFormInfo implements IRerference {
    private _uiForm: IUIForm | null = null;
    private _paused: boolean = false;
    private _covered: boolean = false;

    get uiForm(): IUIForm {
        return this._uiForm!;
    }

    set paused(value: boolean) {
        this._paused = value;
    }

    get paused(): boolean {
        return this._paused;
    }

    set covered(value: boolean) {
        this._covered = value;
    }

    get covered(): boolean {
        return this._covered;
    }

    static create(uiForm: IUIForm): UIFormInfo {
        let uiFormInfo = ReferencePool.acquire(UIFormInfo);
        uiFormInfo._uiForm = uiForm;
        uiFormInfo._paused = true;
        uiFormInfo._covered = true;
        return uiFormInfo;
    }

    clear(): void {
        this._uiForm = null;
        this._paused = false;
        this._covered = false;
    }
}
