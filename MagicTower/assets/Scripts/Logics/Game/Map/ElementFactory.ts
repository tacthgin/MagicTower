import { AnimationClip, Prefab, SpriteFrame, TiledMapAsset } from "cc";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";

export class ElementFactory {
    /**id对应的动画 */
    private static animations: { [key: number | string]: AnimationClip } = {};

    static async loadAsset() {
        let resouceLoader = GameApp.ResourceManager;
        await resouceLoader.loadDir("Prefabs/Elements", Prefab);
        await resouceLoader.loadDir("TiledMap", TiledMapAsset);
        //await resouceLoader.loadDir("TiledMap/Images", SpriteFrame);
    }

    static getElementSpriteFrame(name: string): SpriteFrame | null {
        return GameApp.ResourceManager.getAsset(`TiledMap/Images/${name}`, SpriteFrame);
    }

    static getHeroSpriteFrame(name: string): SpriteFrame | null {
        return GameApp.ResourceManager.getAsset(`Sprites/${name}`, SpriteFrame);
    }

    static getElementAnimationClip(name: string) {
        if (!this.animations[name]) {
            let spriteFrames = [];
            for (let i = 0; i < 2; i++) {
                spriteFrames.push(this.getElementSpriteFrame(`${name}_${i}`)!);
            }
            let clip = AnimationClip.createWithSpriteFrames(spriteFrames, 20);
            if (clip) {
                clip.name = name;
                clip.wrapMode = AnimationClip.WrapMode.Loop;
                this.animations[name] = clip;
            }
        }

        return this.animations[name];
    }
}
