import { _decorator, Animation } from "cc";
import { GameManager } from "../../../Framework/Managers/GameManager";
import { MapElement } from "./MapElement";
const { ccclass, property } = _decorator;

@ccclass("Shop")
export class Shop extends MapElement {
    onLoad() {
        this.animation = this.getComponent(Animation);
        this.createAnimation("shop");
        this.animation.play("shop");
    }

    protected createAnimationClip() {
        let spriteFrames = [];
        for (let i = 0; i < 2; i++) {
            spriteFrames.push(GameManager.RESOURCE.getSpriteFrame(`pb_m_${i}`));
        }
        return spriteFrames;
    }
}
