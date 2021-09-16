import { Animation, Sprite, _decorator } from "cc";
import { BasePoolNode } from "../../../../Framework/Base/BasePoolNode";
import { GameManager } from "../../../../Framework/Managers/GameManager";
import { ElementManager } from "../ElementManager";
const { ccclass } = _decorator;

@ccclass("MonsterIcon")
export class MonsterIcon extends BasePoolNode {
    private animation: Animation | null = null;
    private monsterInfo: any = null;

    onLoad() {
        this.animation = this.getComponent(Animation);
    }

    init(id: number) {
        this.monsterInfo = GameManager.DATA.getJsonElement("monster", id, true);
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
