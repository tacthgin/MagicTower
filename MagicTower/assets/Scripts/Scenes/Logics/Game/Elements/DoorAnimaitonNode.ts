import { Animation, Sprite, _decorator } from "cc";
import { BasePoolNode } from "../../../../Framework/Base/BasePoolNode";
import { ElementManager } from "../Map/ElementManager";

const { ccclass, property } = _decorator;

@ccclass("DoorAnimationNode")
export class DoorAnimationNode extends BasePoolNode {
    protected callback: Function | null = null;

    onLoad() {
        let animation = this.getComponent(Animation);
        animation?.on(Animation.EventType.FINISHED, this.onFinished, this);
    }

    init(name: string, callback: Function | null) {
        this.callback = callback;
        this.getComponent(Sprite)!.spriteFrame = ElementManager.getInstance().getElementSpriteFrame(name);
        this.getComponent(Animation)?.play(name);
    }

    onFinished() {
        this.remove();
        this.callback && this.callback();
    }
}