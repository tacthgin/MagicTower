import { Node, Tween } from "cc";
import { Constructor } from "../../../Base/DataStruct/Constructor";
import { IRerference } from "../../../Base/ReferencePool/IRerference";
import { ReferencePool } from "../../../Base/ReferencePool/ReferencePool";

export abstract class DialogActionBase implements IRerference {
    private _endActionCallback: () => void = null!;
    private _dialogActionNode: Node = null!;
    private _isEndActionOver: boolean = true;

    protected create(endActionCallback: () => void, dialogActionNode: Node) {
        let dialogAction = ReferencePool.acquire(this.constructor as Constructor<DialogActionBase>);
        dialogAction._endActionCallback = endActionCallback;
        dialogAction._dialogActionNode = dialogActionNode;
        return dialogAction;
    }

    clear(): void {
        this._endActionCallback = null!;
        this._dialogActionNode = null!;
        this._isEndActionOver = true;
    }

    executeStartAction(): void {
        let action = this.getStartAction(this._dialogActionNode);
        if (action) {
            action.start();
        }
    }

    executeEndAction(): void {
        if (this._isEndActionOver) {
            let action = this.getEndAction(this._dialogActionNode);
            if (action) {
                Tween.stopAllByTarget(this._dialogActionNode);
                this._isEndActionOver = false;
                action
                    .call(() => {
                        this._endActionCallback && this._endActionCallback();
                        this._isEndActionOver = true;
                    })
                    .start();
            }
        }
    }

    resetAction(): void {
        this._isEndActionOver = true;
    }

    /**
     * 获取起始动作
     * @returns 起始动作
     */
    protected abstract getStartAction(node: Node): Tween<Node> | null;

    /**
     * 获取终止动作
     * @returns 终止动作
     */
    protected abstract getEndAction(node: Node): Tween<Node> | null;
}
