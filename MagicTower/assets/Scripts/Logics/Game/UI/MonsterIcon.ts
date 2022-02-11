import { Animation, Component, Sprite, _decorator } from "cc";
import { Utility } from "../../../../GameFramework/Scripts/Utility/Utility";
import { ElementFactory } from "../Map/ElementFactory";

const { ccclass, type } = _decorator;

@ccclass("MonsterIcon")
export class MonsterIcon extends Component {
    @type(Animation)
    private animation: Animation = null!;
    private monsterInfo: any = null;

    init(id: number) {
        this.monsterInfo = Utility.Json.getJsonElement("monster", id, true);
        this.getComponent(Sprite)!.spriteFrame = ElementFactory.getElementSpriteFrame(`${this.monsterInfo.spriteId}_0`);
        let animationState = this.animation.getState(this.monsterInfo.spriteId);
        if (!animationState) {
            this.animation.createState(ElementFactory.getElementAnimationClip(this.monsterInfo.spriteId), this.monsterInfo.spriteId);
        }
        this.animation.play(this.monsterInfo.spriteId);
    }
}
