import { Animation, Component, Sprite, _decorator } from "cc";
import { Utility } from "../../../../GameFramework/Scripts/Utility/Utility";
const { ccclass } = _decorator;

@ccclass("MonsterIcon")
export class MonsterIcon extends Component /*BasePoolNode*/ {
    private animation: Animation | null = null;
    private monsterInfo: any = null;

    onLoad() {
        this.animation = this.getComponent(Animation);
    }

    init(id: number) {
        this.monsterInfo = Utility.Json.getJsonElement("monster", id, true);
        this.getComponent(Sprite)!.spriteFrame = ElementManager.getInstance().getElementSpriteFrame(`${this.monsterInfo.spriteId}_0`);
        this.animation?.play(this.monsterInfo.spriteId);
    }

    createAnimationClip() {
        let spriteFrames = [];
        for (let i = 0; i < 2; i++) {
            spriteFrames.push(ElementManager.getInstance().getElementSpriteFrame(`${this.monsterInfo.spriteId}_${i}`));
        }
        return spriteFrames;
    }
}
