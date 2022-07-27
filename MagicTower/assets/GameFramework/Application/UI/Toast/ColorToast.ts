import { RichText, tween, UITransform, v3, Vec3, view, _decorator } from "cc";
import { GameApp } from "../../GameApp";
import { ToastType } from "./ToastType";
import { ToastUIForm } from "./ToastUIForm";

const { ccclass, property } = _decorator;

const SHORTEST_LENGTH: number = 120;

@ccclass("ColorToast")
export class ColorToast extends ToastUIForm {
    @property(RichText)
    toastLabel: RichText = null!;

    onOpen(userData: { content: string; toastType?: ToastType }) {
        userData.toastType = userData.toastType || ToastType.NORAML;
        if (userData.toastType == ToastType.NORAML) {
            userData.content = `<color=#ffffff>${userData.content}</color>`;
        }
        this.toastLabel.string = userData.content;
        let transform = this.node.getComponent(UITransform)!;
        let labelTransform = this.toastLabel.node.getComponent(UITransform)!;
        if (labelTransform.width > SHORTEST_LENGTH) {
            transform.width = labelTransform.width + 50;
        } else {
            transform.width = SHORTEST_LENGTH;
        }

        this.runToastAction();
    }

    runToastAction() {
        tween(this.node)
            .set({ position: v3(0, view.getVisibleSize().y * 0.25) })
            .by(0.5, { position: new Vec3(0, 60, 0) })
            .delay(1)
            .call(() => {
                GameApp.UIManager.closeUIForm(this);
            })
            .start();
    }
}
