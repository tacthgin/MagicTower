import { Component, _decorator, Node, UITransform, view, EventTouch } from "cc";
import { ActionComponent } from "../Components/ActionComponent";
import { DialogAction } from "../Constant/BaseConstant";
import { BaseEvent } from "../Constant/BaseEvent";
import { NotifyCenter } from "../Managers/NotifyCenter";

const { ccclass, property } = _decorator;

@ccclass("BaseDialog")
export default class BaseDialog extends Component {
    @property({
        type: Node,
        tooltip: "背景区域，用于做点击关闭，及事件屏蔽",
    })
    private touchNode: UITransform;

    @property({
        type: Node,
        tooltip: "弹窗中心内容，适用于做弹窗动作，默认选择弹窗node",
    })
    private dialogContent: Node;

    /** 点击弹窗空白关闭 */
    @property({
        tooltip: "点击弹窗空白关闭",
    })
    protected clickBgClose: boolean = true;

    /** 关闭弹窗是否摧毁 */
    @property({
        tooltip: "关闭弹窗是否摧毁",
    })
    protected closeWithDestroy: boolean = true;

    /** 使用弹窗动作 */
    @property({
        tooltip: "是否使用弹窗动作，默认无动作，数值可从BaseConstant查看",
    })
    protected actionType: DialogAction = DialogAction.NoneAction;

    /** 动作组件 */
    private actionComponent: ActionComponent = null;

    /** 处理单点或者多点触摸，保证id唯一 */
    private touchId: number = null;

    /** 加载背景按钮等初始化 */
    onLoad() {
        if (this.touchNode) {
            this.touchNode.contentSize = view.getFrameSize();

            this.touchNode.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.touchNode.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.touchNode.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.touchNode.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }

        if (this.actionType != DialogAction.NoneAction) {
            this.addActionComponent(this.actionType);
        }

        this.dialogContent = this.dialogContent || this.node;
    }

    onEnable() {
        this.actionComponent && this.actionComponent.executeStartAction(this.dialogContent);
        NotifyCenter.emit(BaseEvent.SHOW_DIALOG, this.node.name);
    }

    /** 如果弹窗做成缓存，注册事件放在onEnable和onDisable */
    onDisable() {
        NotifyCenter.emit(BaseEvent.HIDE_DIALOG, this.node.name);
        NotifyCenter.targetOff(this);
    }

    onTouchStart(event: EventTouch) {
        event.propagationStopped = true;
        if (this.touchId != null && this.touchId != event.getID()) {
            return;
        }

        this.touchId = event.getID(); //处理多点触摸
    }

    onTouchMove(event: EventTouch) {
        event.propagationStopped = true;
    }

    onTouchEnd(event: EventTouch) {
        if (event.getID() == this.touchId) {
            this.touchId = null;
            if (this.clickBgClose) {
                this.close();
            }
        }
        event.propagationStopped = true;
    }

    private addActionComponent(actionType: DialogAction) {
        let actionComponent = ActionComponent.getActionComponent(actionType);
        if (!this.getComponent(actionComponent)) {
            this.actionComponent = this.addComponent(actionComponent);
            this.actionComponent.EndActionCallback = this.closeCallback;
        }
    }

    private closeCallback() {
        this.unscheduleAllCallbacks();
        if (this.closeWithDestroy) {
            this.node.destroy();
        } else {
            this.node.active = false;
        }
    }

    /** 关闭弹窗 */
    protected close() {
        if (this.actionComponent) {
            this.actionComponent.executeEndAction(this.dialogContent);
        } else {
            this.closeCallback();
        }
    }
}
