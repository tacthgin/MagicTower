import { Component, Sprite, Animation, _decorator, Tween, tween, Node, UIOpacity, v3 } from "cc";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { IVec2 } from "../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { Utility } from "../../../../GameFramework/Scripts/Utility/Utility";
import { ElementFactory } from "../Map/ElementFactory";

const { ccclass, property } = _decorator;

@ccclass("ElementNode")
export class ElementNode extends Component {
    @property(Animation)
    private animation: Animation = null!;

    init(layerName: string, id: number | string) {
        let json = Utility.Json.getJsonElement<any>(layerName, id);
        if (json) {
            let name = json.spriteId;
            this.getComponent(Sprite)!.spriteFrame = ElementFactory.getElementSpriteFrame(`${name}_0`);
            let animationState = this.animation.getState(name);
            if (!animationState) {
                this.animation.createState(ElementFactory.getElementAnimationClip(name), name);
            }
            this.animation.play(name);
        }
    }

    movePath(path: IVec2[], speed: number, callback: Function | null) {
        let moveActions: Tween<Node>[] = [];
        for (let i = 0; i < path.length; i++) {
            moveActions.push(tween().to(speed, { position: v3(path[i].x, path[i].y) }));
        }
        moveActions.push(
            tween().call(() => {
                GameApp.NodePoolManager.releaseNode(ElementNode, this.node);
                callback && callback();
            })
        );

        tween(this.node)
            .sequence(...moveActions)
            .start();
    }

    moveSpwan(info: any, changeCoordFunc: Function) {
        let moveAction: Tween<unknown> = null!;
        let fadeAction: Tween<unknown> = null!;
        for (let actionName in info) {
            switch (actionName) {
                case "move":
                    {
                        moveAction = tween().to(info.interval, { position: changeCoordFunc(changeCoordFunc) });
                    }
                    break;
                case "fadeOut":
                    {
                        fadeAction = tween().to(info.interval, { opacity: 0 });
                    }
                    break;
            }
        }
        tween(this.node).then(moveAction).start();
        tween(this.getComponent(UIOpacity))
            .then(fadeAction)
            .call(() => {
                this.getComponent(UIOpacity)!.opacity = 255;
                GameApp.NodePoolManager.releaseNode(ElementNode, this.node);
            })
            .start();
    }
}
