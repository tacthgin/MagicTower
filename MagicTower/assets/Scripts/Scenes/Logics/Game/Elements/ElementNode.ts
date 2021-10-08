import { Animation, Sprite, tween, Tween, Vec2, _decorator } from "cc";
import { BasePoolNode } from "../../../../Framework/Base/BasePoolNode";
import { GameManager } from "../../../../Framework/Managers/GameManager";
import { ElementManager } from "../Map/ElementManager";

const { ccclass, property } = _decorator;

@ccclass("ElementNode")
export class ElementNode extends BasePoolNode {
    init(layerName: string, id: number | string) {
        let json = GameManager.DATA.getJsonElement(layerName, id);
        if (json) {
            let name = json.spriteId;
            this.getComponent(Sprite)!.spriteFrame = ElementManager.getInstance().getElementSpriteFrame(`${name}_0`);
            let animation = this.getComponent(Animation);
            if (animation?.clips.length == 0) {
                animation.createState(ElementManager.getInstance().getElementAnimationClip(name), name);
            }
            this.getComponent(Animation)?.play(name);
        }
    }

    movePath(path: Vec2[], speed: number, callback: Function | null = null) {
        if (!path) return;
        let moveActions: Tween<unknown>[] = [];
        for (let i = 0; i < path.length - 1; i++) {
            moveActions.push(tween().to(speed, { position: path[i] }));
        }

        callback && moveActions.push(tween().call(callback));
        tween(this.node)
            .sequence(...moveActions)
            .start();
    }
}
