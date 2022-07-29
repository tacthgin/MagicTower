import { Node, Tween } from "cc";
import { IRerference } from "../../../../Script/Base/ReferencePool/IRerference";
import { ReferencePool } from "../../../../Script/Base/ReferencePool/ReferencePool";

export abstract class DialogActionBase implements IRerference {
    private _endActionCallback: () => void = null!;
    private _dialogActionNode: Node = null!;
    private _isEndActionOver: boolean = true;

    clear(): void {
        this._endActionCallback = null!;
        this._dialogActionNode = null!;
        this._isEndActionOver = true;
    }

    initialize(dialogActionNode: Node, endActionCallback: () => void) {
        this._dialogActionNode = dialogActionNode;
        this._endActionCallback = endActionCallback;
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
                        this.endActionCallback();
                    })
                    .start();
            } else {
                this.endActionCallback();
            }
        }
    }

    resetAction(): void {
        this._isEndActionOver = true;
    }

    private endActionCallback() {
        this._endActionCallback && this._endActionCallback();
        this._isEndActionOver = true;
        ReferencePool.release(this);
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
