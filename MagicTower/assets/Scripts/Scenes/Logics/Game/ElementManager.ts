import { SpriteFrame } from "cc";
import { GameManager } from "../../../Framework/Managers/GameManager";

export class ElementManager {
    private spriteFrames: { [key: string]: SpriteFrame } = {};

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
}
