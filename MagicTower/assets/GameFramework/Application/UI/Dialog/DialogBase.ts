import { Button, Enum, EventTouch, Node, screen, UITransform, _decorator } from "cc";
import { IUIGroup } from "../../../Script/UI/IUIGroup";
import { GameApp } from "../../GameApp";
import { DialogAction } from "./DialogAction/DialogAction";
import { DialogActionBase } from "./DialogAction/DialogActionBase";
import { DialogActionFactory } from "./DialogActionFactory";
import { DialogUIForm } from "./DialogUIForm";

const { ccclass, property } = _decorator;

Enum(DialogAction);

@ccclass("DialogBase")
export class DialogBase extends DialogUIForm {
    @property({
        type: UITransform,
        tooltip: "背景区域，用于做点击关闭，及事件屏蔽",
    })
    private touchNode: UITransform = null!;

    @property({
        type: Node,
        tooltip: "弹窗中心内容，适用于做弹窗动作，默认选择弹窗node",
    })
    private dialogContent: Node = null!;

    /** 点击弹窗空白关闭 */
    @property({
        tooltip: "点击弹窗空白关闭",
    })
    private clickBgClose: boolean = false;

    /** 使用弹窗动作 */
    @property({
        tooltip: "弹窗默认动作",
        type: DialogAction,
    })
    private actionType: DialogAction = DialogAction.NoneAction;

    /** 处理单点或者多点触摸，保证id唯一 */
    private touchId: number | null = null;
    /** 运行中的弹窗动作 */
    private _dialogAction: DialogActionBase | null = null;

    /** 加载背景按钮等初始化 */
    __preload() {
        this.dialogContent = this.dialogContent || this.node;
        if (this.touchNode) {
            this.touchNode.contentSize = screen.windowSize;
        }
    }

    onInit(serialId: number, uiFormAssetName: string, uiGroup: IUIGroup, pauseCoveredUIForm: boolean, isNewInstance: boolean, userData?: Object) {
        super.onInit(serialId, uiFormAssetName, uiGroup, pauseCoveredUIForm, isNewInstance, userData);
        this.registerTouchEvent();
        if (!this._dialogAction) {
            this._dialogAction = DialogActionFactory.getAction(this.actionType, this.dialogContent, this.closeCallback.bind(this));
        }
        this._dialogAction.executeStartAction();
    }

    /**
     * 关闭弹窗接口
     * @param useAction 默认使用动作关闭
     */
    close(useAction: boolean = true) {
        if (useAction) {
            this._dialogAction?.executeEndAction();
        } else {
            this._dialogAction?.resetAction();
            this.closeCallback();
        }
    }

    private registerTouchEvent() {
        if (this.touchNode) {
            this.touchNode.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.touchNode.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.touchNode.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.touchNode.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
    }

    private unregisterTouchEvent() {
        if (this.touchNode) {
            this.touchNode.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.touchNode.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.touchNode.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.touchNode.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
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
        event.propagationStopped = true;
        if (event.getID() == this.touchId) {
            this.touchId = null;
            if (this.clickBgClose) {
                this.close();
            }
        }
    }

    private closeCallback() {
        this._dialogAction = null;
        this.unregisterTouchEvent();
        GameApp.UIManager.closeUIForm(this);
        this.node.removeFromParent();
    }

    private onCloseBtnClick(button: Button, customEventData: string) {
        this.close();
    }
}
