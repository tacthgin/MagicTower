import { Animation, Component, Sprite, _decorator } from "cc";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
const { ccclass, property } = _decorator;

@ccclass("DoorAnimationReverseNode")
export class DoorAnimationReverseNode extends Component {
    protected callback: Function | null = null;

    onLoad() {
        let animation = this.getComponent(Animation);
        animation?.on(Animation.EventType.FINISHED, this.onFinished, this);
    }

    init(name: string, callback: Function | null) {
        this.callback = callback;
        this.getComponent(Sprite)!.spriteFrame = null;
        this.getComponent(Animation)?.play(`${name}_reverse`);
    }

    onFinished() {
        GameApp.NodePoolManager.releaseNode(DoorAnimationReverseNode, this.node);
        this.callback && this.callback();
    }
}
