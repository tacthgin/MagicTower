import { Component, js, Node, tween, Vec3, _decorator } from "cc";

const { ccclass } = _decorator;

export enum DialogAction {
    NoneAction = "NoneAction",
    ScaleAction = "ScaleAction",
}

/** 结点消失的时候动作回调 */
export abstract class ActionComponent extends Component {
    protected _endActionCallback: () => void = null;

    protected _dialogContentNode: Node = null;

    public set endActionCallback(callback: any) {
        this._endActionCallback = callback;
    }

    public set dialogContentNode(node: Node) {
        this._dialogContentNode = node;
    }

    public abstract executeStartAction(): void;
    public abstract executeEndAction(): void;

    static getActionComponent(dialogAction: DialogAction) {
        return js.getClassByName(dialogAction);
    }

    onEnable() {
        this.executeStartAction();
    }
}

/** 无弹窗动作 */
class NoneAction extends ActionComponent {
    public executeStartAction() {}
    public executeEndAction() {
        this.endActionCallback();
    }
}

/** 弹窗缩放 从小到大，从大到小 */
class ScaleAction extends ActionComponent {
    public executeStartAction() {
        tween(this._dialogContentNode)
            .set({ scale: new Vec3(0.1, 0.1, 0.1) })
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .start();
    }
    public executeEndAction() {
        tween(this._dialogContentNode)
            .stop()
            .to(0.3, { scale: new Vec3(0, 0, 0) })
            .call(this.endActionCallback.bind(this))
            .start();
    }
}
