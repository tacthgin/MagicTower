import { AnimationClip, Constructor, Prefab, SpriteFrame, TiledMapAsset } from "cc";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { IObjectPool } from "../../../../GameFramework/Scripts/ObjectPool/IObjectPool";
import { Element } from "../../../Model/MapModel/Data/Elements/Element";
import { ElementObject } from "../../../Model/MapModel/Data/Elements/ElementObject";

export class ElementFactory {
    /**id对应的动画 */
    private static animations: { [key: number | string]: AnimationClip } = {};

    static getElementSpriteFrame(name: string): SpriteFrame | null {
        return GameApp.ResourceManager.getAsset(`TiledMap/Images/${name}`, SpriteFrame);
    }

    static getHeroSpriteFrame(name: string): SpriteFrame | null {
        return GameApp.ResourceManager.getAsset(`Sprite/${name}`, SpriteFrame);
    }

    static getElementAnimationClip(name: string) {
        if (!this.animations[name]) {
            let spriteFrames = [];
            for (let i = 0; i < 2; i++) {
                spriteFrames.push(this.getElementSpriteFrame(`${name}_${i}`)!);
            }
            let clip = AnimationClip.createWithSpriteFrames(spriteFrames, 10);
            if (clip) {
                clip.name = name;
                clip.wrapMode = AnimationClip.WrapMode.Loop;
                this.animations[name] = clip;
            }
        }

        return this.animations[name];
    }
}
