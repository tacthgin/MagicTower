import { ReferencePool } from "../Base/ReferencePool/ReferencePool";
import { ObjectBase } from "../ObjectPool/ObjectBase";
import { IUIFormHelp } from "./IUIFormHelp";

export class UIFormInstanceObject extends ObjectBase {
    private _uiFormAsset: object | null = null;
    private _uiFormHelper: IUIFormHelp | null = null;

    static create(name: string, uiFormAsset: object, uiFormInstance: object, uiFormHelper: IUIFormHelp): UIFormInstanceObject {
        let uiFromInstanceObject = ReferencePool.acquire(UIFormInstanceObject);
        uiFromInstanceObject.initialize(name, uiFormInstance);
        uiFromInstanceObject._uiFormAsset = uiFormAsset;
        uiFromInstanceObject._uiFormHelper = uiFormHelper;
        return uiFromInstanceObject;
    }

    clear(): void {
        super.clear();
        this._uiFormAsset = null;
        this._uiFormHelper = null;
    }

    release(isShutDown: boolean): void {
        this._uiFormHelper?.releaseUIForm(this._uiFormAsset!, this.target);
    }
}
