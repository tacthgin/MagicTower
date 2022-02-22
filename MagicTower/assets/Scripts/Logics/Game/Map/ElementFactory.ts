import { AnimationClip, Constructor, Prefab, SpriteFrame, TiledMapAsset } from "cc";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { IObjectPool } from "../../../../GameFramework/Scripts/ObjectPool/IObjectPool";
import { Element } from "../../../Model/MapModel/Data/Elements/Element";
import { ElementObject } from "../../../Model/MapModel/Data/Elements/ElementObject";

export class ElementFactory {
    /**id对应的动画 */
    private static animations: { [key: number | string]: AnimationClip } = {};
    private static elementObjectPool: IObjectPool<ElementObject> = null!;

    static initliaze() {
        this.elementObjectPool = GameApp.ObjectPoolManager.createSingleSpawnObjectPool(ElementObject, "element object");
    }

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

    static createElementData<T extends Element>(elementConstructor: Constructor<T>, name: string): T {
        let elementObject = this.elementObjectPool.spawn(name);
        if (elementObject) {
            return elementObject.target as T;
        } else {
            let element = new elementConstructor();
            elementObject = ElementObject.create(name, element);
            this.elementObjectPool.register(elementObject, true);
            return element;
        }
    }

    static releaseElementData<T extends Element>(element: T): void {
        this.elementObjectPool.upspawn(element);
    }

    static clear() {
        GameApp.ObjectPoolManager.destroyObjectPool(ElementObject, "element object");
    }
}
