import { _decorator, Animation, Sprite, SpriteFrame } from "cc";
import { GameManager } from "../../../Framework/Managers/GameManager";
import { MapElement } from "./MapElement";

const { ccclass } = _decorator;

@ccclass("Common")
export class Common extends MapElement {
    private elementName: string = null;

    onLoad() {
        this.animation = this.getComponent(Animation);
    }

    init(name: string) {
        this.elementName = name;
        if (this.elementName.indexOf("fire") != -1 || this.elementName.indexOf("star") != -1) {
            this.createAnimation(this.elementName);
        } else {
            this.animation.stop();
        }
        this.getComponent(Sprite).spriteFrame = GameManager.RESOURCE.getSpriteFrame(this.elementName);
    }

    remove() {
        super.remove(true);
    }

    add() {}

    protected createAnimationClip(): SpriteFrame[] {
        let spriteFrames = [];
        let prefix = this.elementName.substring(0, this.elementName.indexOf("_"));
        for (let i = 0; i < 2; i++) {
            spriteFrames.push(GameManager.RESOURCE.getSpriteFrame(`${prefix}_${i}`));
        }
        return spriteFrames;
    }

    isWall() {
        return this.elementName.indexOf("door") != -1;
    }

    isLava() {
        return this.elementName.indexOf("fire") != -1;
    }
}
