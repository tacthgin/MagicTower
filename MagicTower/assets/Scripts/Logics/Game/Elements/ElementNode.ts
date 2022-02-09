import { Component, Sprite, Animation, _decorator, Tween, tween, Node } from "cc";
import { IVec2 } from "../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { Utility } from "../../../../GameFramework/Scripts/Utility/Utility";
import { ElementFactory } from "../Map/ElementFactory";

const { ccclass, property } = _decorator;

@ccclass("ElementNode")
export class ElementNode extends Component {
    @property(Animation)
    private animation: Animation = null!;

    init(layerName: string, id: number | string) {
        let json = Utility.Json.getJsonElement(layerName, id) as any;
        if (json) {
            let name = json.spriteId;
            this.getComponent(Sprite)!.spriteFrame = ElementFactory.getElementSpriteFrame(`${name}_0`);
            if (this.animation.clips.length == 0) {
                this.animation.createState(ElementFactory.getElementAnimationClip(name), name);
            }
            this.animation.play(name);
        }
    }

    movePath(path: IVec2[], speed: number) {
        let moveActions: Tween<Node>[] = [];

        for (let i = 0; i < path.length - 1; i++) {
            moveActions.push(tween().to(speed, { position: path[i] }));
        }
        tween(this.node)
            .sequence(...moveActions)
            .start();
    }
}
