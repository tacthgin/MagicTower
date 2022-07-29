import { Component } from "cc";
import { IUIForm } from "../../../Script/UI/IUIForm";
import { IUIGroup } from "../../../Script/UI/IUIGroup";

export class DialogUIForm extends Component implements IUIForm {
    private _serialId: number = -1;
    private _uiFormAssetName: string = "";
    private _uiGroup: IUIGroup = null!;
    private _depthInUIGroup: number = 0;
    private _pauseCoveredUIForm: boolean = true;

    get serialId(): number {
        return this._serialId;
    }

    get uiFormAssetName(): string {
        return this._uiFormAssetName;
    }

    get handler(): object {
        return this.node;
    }

    get uiGroup(): IUIGroup {
        return this._uiGroup;
    }

    get depthInUIGroup(): number {
        return this._depthInUIGroup;
    }

    get pauseCoveredUIForm(): boolean {
        return this._pauseCoveredUIForm;
    }

    onInit(serialId: number, uiFormAssetName: string, uiGroup: IUIGroup, pauseCoveredUIForm: boolean, isNewInstance: boolean, userData?: Object): void {
        this._serialId = serialId;
        this._uiFormAssetName = uiFormAssetName;
        this._uiGroup = uiGroup;
        this._pauseCoveredUIForm = pauseCoveredUIForm;
    }

    onRecyle(): void {}

    onOpen(userData?: Object): void {}

    onClose(isShutDown: boolean, userData?: Object): void {}

    onPause(): void {}

    onResume(): void {}

    onCover(): void {}

    onReveal(): void {}

    onRefocus(userData?: Object): void {}

    onUpdate(elapseSeconds: number): void {}

    onDepthChanged(uiGroupDepth: number, depthInUIGroup: number): void {}
}
