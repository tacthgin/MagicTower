import { Animation, Component, Sprite, _decorator } from "cc";
import { GameApp } from "../../../../GameFramework/Application/GameApp";
import { ElementFactory } from "../Map/ElementFactory";

const { ccclass, property } = _decorator;

@ccclass("DoorAnimationNode")
export class DoorAnimationNode extends Component {
    protected callback: Function | null = null;

    onLoad() {
        let animation = this.getComponent(Animation);
        animation?.on(Animation.EventType.FINISHED, this.onFinished, this);
    }

    init(name: string, callback: Function | null) {
        this.callback = callback;
        this.getComponent(Sprite)!.spriteFrame = ElementFactory.getElementSpriteFrame(name);
        this.getComponent(Animation)?.play(name);
    }

    onFinished() {
        GameApp.NodePoolManager.releaseNode(DoorAnimationNode, this.node);
        this.callback && this.callback();
    }
}
