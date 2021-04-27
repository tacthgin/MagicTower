import { _decorator, Component, Animation, SpriteFrame, Sprite } from "cc";
import { GameManager } from "../../../../Framework/Managers/GameManager";
import { MapElement } from "../Elements/Base/MapElement";
const { ccclass } = _decorator;

@ccclass("MonsterIcon")
export class MonsterIcon extends MapElement {
    private monsterInfo: any = null;

    onLoad() {
        this.animation = this.getComponent(Animation);
    }

    init(id: number) {
        this.monsterInfo = GameManager.DATA.getJsonElement("monster", id, true);
        this.getComponent(Sprite).spriteFrame = GameManager.RESOURCE.getSpriteFrame(`${this.monsterInfo.spriteId}_0`);
        this.createAnimation(this.monsterInfo.spriteId);
        this.animation.play(this.monsterInfo.spriteId);
    }

    createAnimationClip() {
        let spriteFrames = [];
        for (let i = 0; i < 2; i++) {
            spriteFrames.push(GameManager.RESOURCE.getSpriteFrame(`${this.monsterInfo.spriteId}_${i}`));
        }
        return spriteFrames;
    }
}
