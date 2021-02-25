import { Component, Node, tween, Vec3, _decorator } from "cc";
import { DialogAction } from "../Constant/BaseConstant";

const { ccclass } = _decorator;

export abstract class ActionComponent extends Component {
    /** 结点消失的时候动作回调 */
    protected endActionCallback: () => void = null;
    public set EndActionCallback(callback: () => void) {
        this.endActionCallback = callback;
    }
    public abstract executeStartAction(node: Node): void;
    public abstract executeEndAction(node: Node): void;

    static getActionComponent(dialogAction: DialogAction) {
        switch (dialogAction) {
            case DialogAction.ScaleAction:
                return ScaleAction;
            default:
                return null;
        }
    }
}

/** 弹窗缩放 从小到大，从大到小 */
@ccclass("ScaleAction")
class ScaleAction extends ActionComponent {
    public executeStartAction(node: Node) {
        node &&
            tween(node)
                .set({ scale: new Vec3(0.1, 0.1, 0.1) })
                .to(0.3, { scale: new Vec3(1, 1, 1) })
                .start();
    }
    public executeEndAction(node: Node) {
        node &&
            tween(this.node)
                .stop()
                .to(0.3, { scale: new Vec3(0, 0, 0) })
                .call(this.endActionCallback.bind(this))
                .start();
    }
}
