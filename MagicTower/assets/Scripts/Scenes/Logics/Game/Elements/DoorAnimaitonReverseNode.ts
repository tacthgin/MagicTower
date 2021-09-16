import { Sprite, _decorator } from "cc";
import { DoorAnimationNode } from "./DoorAnimaitonNode";
const { ccclass, property } = _decorator;

@ccclass("DoorAnimationReverseNode")
export class DoorAnimationReverseNode extends DoorAnimationNode {
    init(name: string, callback: Function | null) {
        super.init(name, callback);
        this.getComponent(Sprite)!.spriteFrame = null;
    }
}
