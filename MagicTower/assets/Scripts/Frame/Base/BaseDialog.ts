import { Component, Enum, EventTouch, Node, UITransform, view, _decorator } from "cc";
import { ActionComponent } from "../Components/ActionComponent";
import { DialogAction } from "../Constant/BaseContant";
import { GameManager } from "../Managers/GameManager";

const { ccclass, property } = _decorator;

Enum(DialogAction);

@ccclass("BaseDialog")
export abstract class BaseDialog extends Component {
    @property({
        tooltip: "背景区域，用于做点击关闭，及事件屏蔽",
    })
    private touchNode: UITransform = null;

    @property({
        type: Node,
        tooltip: "弹窗中心内容，适用于做弹窗动作，默认选择弹窗node",
    })
    private dialogContent: Node = null;

    /** 点击弹窗空白关闭 */
    @property({
        tooltip: "点击弹窗空白关闭",
    })
    private clickBgClose: boolean = false;

    /** 关闭弹窗是否摧毁 */
    @property({
        tooltip: "关闭弹窗是否摧毁",
    })
    private closeWithDestroy: boolean = true;

    /** 使用弹窗动作 */
    @property({
        tooltip: "弹窗默认动作",
        type: DialogAction,
    })
    private actionType: DialogAction = DialogAction.NoneAction;

    /** 处理单点或者多点触摸，保证id唯一 */
    private touchId: number = null;

    /** 加载背景按钮等初始化 */
    __preload() {
        if (this.touchNode) {
            this.touchNode.contentSize = view.getFrameSize();

            this.touchNode.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.touchNode.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.touchNode.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.touchNode.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
        this.dialogContent = this.dialogContent || this.node;
        this.addActionComponent();
    }

    private onTouchStart(event: EventTouch) {
        event.propagationStopped = true;
        if (this.touchId != null && this.touchId != event.getID()) {
            return;
        }

        this.touchId = event.getID(); //处理多点触摸
    }

    private onTouchMove(event: EventTouch) {
        event.propagationStopped = true;
    }

    private onTouchEnd(event: EventTouch) {
        if (event.getID() == this.touchId) {
            this.touchId = null;
            if (this.clickBgClose) {
                this.close();
            }
        }
        event.propagationStopped = true;
    }

    private getActionComponent() {
        let actionComponent: any = ActionComponent.getActionComponent(this.actionType);
        return this.getComponent<ActionComponent>(actionComponent);
    }

    private addActionComponent() {
        let actionComponent: any = this.getActionComponent();
        if (!actionComponent) {
            actionComponent = ActionComponent.getActionComponent(this.actionType);
            let component: ActionComponent = this.addComponent(actionComponent);
            if (component) {
                component.endActionCallback = this.closeCallback;
                component.dialogContentNode = this.dialogContent;
            }
        }
    }

    private closeCallback() {
        GameManager.UI.closeDialogCallback(this.node.name);
        this.unscheduleAllCallbacks();
        if (this.closeWithDestroy) {
            this.node.destroy();
        } else {
            this.node.active = false;
        }
    }

    /** 关闭弹窗 */
    protected close(useAction: boolean = true) {
        if (useAction) {
            this.getActionComponent().executeEndAction();
        } else {
            this.closeCallback();
        }
    }

    /** 执行弹窗打开动作 */
    executeStartAction() {
        this.getActionComponent().executeStartAction();
    }

    abstract init(...args: any[]): void;
}
