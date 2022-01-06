import { Animation, Component, Sprite, _decorator } from "cc";
import { Utility } from "../../../../GameFramework/Scripts/Utility/Utility";
import { ElementFactory } from "../Map/ElementFactory";

const { ccclass } = _decorator;

@ccclass("MonsterIcon")
export class MonsterIcon extends Component {
    private animation: Animation | null = null;
    private monsterInfo: any = null;

    onLoad() {
        this.animation = this.getComponent(Animation);
    }

    init(id: number) {
        this.monsterInfo = Utility.Json.getJsonElement("monster", id, true);
        this.getComponent(Sprite)!.spriteFrame = ElementFactory.getElementSpriteFrame(`${this.monsterInfo.spriteId}_0`);
        this.animation?.play(this.monsterInfo.spriteId);
    }

    createAnimationClip() {
        let spriteFrames = [];
        for (let i = 0; i < 2; i++) {
            spriteFrames.push(ElementFactory.getElementSpriteFrame(`${this.monsterInfo.spriteId}_${i}`));
        }
        return spriteFrames;
    }
}
