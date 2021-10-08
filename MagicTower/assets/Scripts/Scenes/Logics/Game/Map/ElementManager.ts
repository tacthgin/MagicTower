import { AnimationClip, assert, SpriteFrame } from "cc";
import { GameManager } from "../../../../Framework/Managers/GameManager";

export class ElementManager {
    private spriteFrames: { [key: string]: SpriteFrame } = {};
    /**id对应的动画 */
    private animations: { [key: number | string]: AnimationClip } = {};

    static instance: ElementManager | null = null;

    static getInstance() {
        if (!ElementManager.instance) {
            ElementManager.instance = new ElementManager();
        }
        return ElementManager.instance;
    }

    async loadAsset() {
        await GameManager.RESOURCE.loadPrefabDir("Prefabs/Elements");
        let spriteFrames = await GameManager.RESOURCE.loadAssetDir("TiledMap/Images", SpriteFrame);
        spriteFrames?.forEach((spriteFrame) => {
            this.spriteFrames[spriteFrame.name] = spriteFrame;
        });
    }

    getElementSpriteFrame(name: string): SpriteFrame | null {
        return this.spriteFrames[name] || null;
    }

    getElementAnimationClip(name: string) {
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
