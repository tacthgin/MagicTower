import { Component, instantiate, Node, UITransform, v3, _decorator } from "cc";
import { GameFrameworkError } from "../../../Script/Base/GameFrameworkError";
import { IUIForm } from "../../../Script/UI/IUIForm";
import { IUIFormHelper } from "../../../Script/UI/IUIFormHelper";
import { IUIGroup } from "../../../Script/UI/IUIGroup";
import { IUIGroupHelper } from "../../../Script/UI/IUIGroupHelper";
import { UIConstant } from "../UIConstant";
import { CUIGroupHelper } from "./CUIGroupHelper";

const { ccclass, property } = _decorator;

@ccclass("CUIFormHelper")
export class CUIFormHelper extends Component implements IUIFormHelper {
    @property(Node)
    private dialogLayer: Node = null!;

    @property(Node)
    private toastLayer: Node = null!;

    private layers: Node[] = null!;

    onLoad() {
        if (!this.dialogLayer || !this.toastLayer) {
            throw new GameFrameworkError("set dialog layer or toast layer first");
        }

        //初始化弹窗层和toast层的大小和位置
        this.layers = [this.dialogLayer, this.toastLayer];
        this.layers.forEach((layer) => {
            layer.position = v3(screen.width * 0.5, screen.height * 0.5);
            let uiTransform = layer.getComponent(UITransform);
            if (uiTransform) {
                uiTransform.width = screen.width;
                uiTransform.height = screen.height;
            }
        });
    }

    instantiateUIForm(uiFormAsset: object): object {
        return instantiate(uiFormAsset);
    }

    createUIForm(uiFormInstance: object, uiGroup: IUIGroup, userData?: Object): IUIForm | null {
        let index = -1;
        switch (uiGroup.name) {
            case UIConstant.DIALOG_LAYER_GROUP:
                index = 0;
                break;
            case UIConstant.TOAST_LAYER_GROUP:
                index = 1;
                break;
            default:
                break;
        }

        let layer = this.layers[index];
        if (layer) {
            let node = uiFormInstance as Node;
            node.parent = layer;
            let component = node.getComponent(node.name);
            return component ? (component as unknown as IUIForm) : null;
        }

        return null;
    }

    releaseUIForm(uiFormAsset: object, uiFormInstance: object): void {
        (uiFormInstance as Node).destroy();
    }

    getDialogUIGroupHelp(): IUIGroupHelper {
        return this.dialogLayer.getComponent(CUIGroupHelper)!;
    }

    getToastUIGroupHelp(): IUIGroupHelper {
        return this.toastLayer.getComponent(CUIGroupHelper)!;
    }
}
