import { Component, instantiate, Node, UITransform, v3, _decorator } from "cc";
import { GameFrameworkError } from "../../Base/GameFrameworkError";
import { IUIForm } from "../../UI/IUIForm";
import { IUIFormHelp } from "../../UI/IUIFormHelp";
import { IUIGroup } from "../../UI/IUIGroup";
const { ccclass, property } = _decorator;

@ccclass("CUIFormHelp")
export class CUIFormHelp extends Component implements IUIFormHelp {
    @property(Node)
    private dialogLayer: Node = null!;

    @property(Node)
    private toastLayer: Node = null!;

    onLoad() {
        if (!this.dialogLayer || !this.toastLayer) {
            throw new GameFrameworkError("set dialog layer or toast layer first");
        }

        //初始化弹窗层和toast层的大小和位置
        let layers = [this.dialogLayer, this.toastLayer];
        layers.forEach((layer) => {
            layer.position = v3(screen.width * 0.5, screen.height * 0.5);
            let uiTransform = layer.getComponent(UITransform);
            if (uiTransform) {
                uiTransform.width = screen.width;
                uiTransform.height = screen.height;
            }
        });
    }

    /**
     * 弹窗UI组名
     */
    static readonly DIALOG_LAYER_GROUP: string = "DIALOG_LAYER_GROUP";

    /**
     * 飘字UI组名
     */
    static readonly TOAST_LAYER_GROUP: string = "DIALOG_LAYER_GROUP";

    instantiateUIForm(uiFormAsset: object): object {
        return instantiate(uiFormAsset);
    }

    createUIForm(uiFormInstance: object, uiGroup: IUIGroup, userData?: Object): IUIForm | null {
        switch (uiGroup.name) {
            case CUIFormHelp.DIALOG_LAYER_GROUP:
                (uiFormInstance as Node).parent = this.dialogLayer;
                return uiFormInstance as IUIForm;
            case CUIFormHelp.TOAST_LAYER_GROUP:
                (uiFormInstance as Node).parent = this.toastLayer;
                return uiFormInstance as IUIForm;
            default:
                return null;
        }
    }

    releaseUIForm(uiFormAsset: object, uiFormInstance: object): void {
        (uiFormInstance as Node).removeFromParent();
    }
}
