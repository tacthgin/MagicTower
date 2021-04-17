import { _decorator, Node, Animation, Vec2, tween, Sprite, UITransform, SpriteFrame, AnimationClip } from "cc";
import { GameManager } from "../../../Framework/Managers/GameManager";
import { Util } from "../../../Framework/Util/Util";
import { MapElement } from "./MapElement";

const { ccclass, property } = _decorator;

@ccclass("Monster")
export class Monster extends MapElement {
    @property(Node)
    lightning: Node = null;

    private _monsterInfo: any = null;
    private animation: Animation = null;
    private globalInfo: any = null;
    private _firstAttack: boolean = false;
    private _monsterMove: boolean = false;

    get monsterInfo() {
        return this._monsterInfo;
    }

    set firstAttack(value) {
        this._firstAttack = value;
    }

    get firstAttack() {
        return this._firstAttack;
    }

    set monsterMove(value) {
        this._monsterMove = value;
    }

    get monsterMove() {
        return this._monsterMove;
    }

    onLoad() {
        this.animation = this.getComponent(Animation);
        this.globalInfo = GameManager.DATA.getJson("global");
    }

    start() {
        this.createAnimation();
    }

    init(id: number) {
        this._monsterInfo = GameManager.DATA.getJsonElement("monster", id, true);
        this._firstAttack = this._monsterInfo.firstAttack;
        this.node.getComponent(UITransform).anchorY = this._monsterInfo.big ? 0.15 : 0.5;
        this.getComponent(Sprite).spriteFrame = GameManager.RESOURCE.getSpriteFrame(`${this._monsterInfo.spriteId}_0`);
        this.createAnimation();
    }

    private createAnimation() {
        if (!this.animation) return;
        let index = this.animation.clips.findIndex((clip) => {
            return clip.name == this._monsterInfo.spriteId;
        });
        if (index == -1) {
            let spriteFrames = [];
            for (let i = 0; i < 2; i++) {
                spriteFrames.push(GameManager.RESOURCE.getSpriteFrame(`${this._monsterInfo.spriteId}_${i}`));
            }
            let clip = AnimationClip.createWithSpriteFrames(spriteFrames, 8);
            clip.name = this._monsterInfo.spriteId;
            clip.wrapMode = AnimationClip.WrapMode.Loop;
            this.animation.clips.push(clip);
        }
        this.animation.play(this._monsterInfo.spriteId);
    }

    hurt(damage: number) {
        this._monsterInfo.hp = Util.clamp(this._monsterInfo.hp - damage, 0, Number.MAX_VALUE);
        return this._monsterInfo.hp == 0;
    }

    movePath(path: Vec2[], speed: number = 1) {
        return new Promise((resolve) => {
            let moveActions = [];
            path.forEach((position) => {
                moveActions.push(cc.moveTo(this.globalInfo.npcSpeed * speed, position));
            });
            moveActions.push(
                cc.callFunc(() => {
                    resolve();
                })
            );
            cc.tween(this.node)
                .sequence(moveActions)
                .call(() => {
                    resolve();
                })
                .start();
        });
    }

    beAttack() {
        let icon = ElementManager.getCommon("attack");
        icon.parent = this.node;
        icon.position = cc.Vec3.ZERO;
        tween(icon).delay(this.globalInfo.fadeInterval).removeSelf().start();
    }

    move(vec: Vec2, callback: any) {
        tween(this.node).by(this.globalInfo.npcSpeed, { position: vec }).call(callback).start();
    }

    weak(ratio: number) {
        this._monsterInfo.attack *= ratio;
        this._monsterInfo.defence *= ratio;
        this._monsterInfo.hp *= ratio;
    }

    isBoss() {
        return this._monsterInfo.boss;
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import { DataManager } from "../../../Managers/DataManager";
// import { ElementManager } from "../ElementManager";
// import MapElement from "./MapElement";
// import { Util } from "../../../Util/Util";
//
// const { ccclass, property } = cc._decorator;
//
// @ccclass
// export class Monster extends MapElement {
//     @property(cc.Node)
//     lightning: cc.Node = null;
//
//     private _monsterInfo: any = null;
//
//     private animation: cc.Animation = null;
//
//     private globalInfo: any = null;
//
//     private _firstAttack: boolean = false;
//
//     private _monsterMove: boolean = false;
//
//     get monsterInfo() {
//         return this._monsterInfo;
//     }
//
//     set firstAttack(value) {
//         this._firstAttack = value;
//     }
//
//     get firstAttack() {
//         return this._firstAttack;
//     }
//
//     set monsterMove(value) {
//         this._monsterMove = value;
//     }
//
//     get monsterMove() {
//         return this._monsterMove;
//     }
//
//     onLoad() {
//         this.animation = this.getComponent(cc.Animation);
//         this.globalInfo = DataManager.getJson("global");
//     }
//
//     start() {
//         this.createAnimation();
//     }
//
//     init(id: number) {
//         this._monsterInfo = DataManager.getJsonElement("monster", id, true);
//         this._firstAttack = this._monsterInfo.firstAttack;
//         this.node.anchorY = this._monsterInfo.big ? 0.15 : 0.5;
//         this.getComponent(cc.Sprite).spriteFrame = ElementManager.getSpriteFrame(`${this._monsterInfo.spriteId}_0`);
//         this.createAnimation();
//     }
//
//     private createAnimation() {
//         if (!this.animation) return;
//         if (
//             this.animation.getClips().filter(value => {
//                 return value.name == this._monsterInfo.spriteId;
//             }).length == 0
//         ) {
//             let spriteFrames = [];
//             for (let i = 0; i < 2; i++) {
//                 spriteFrames.push(ElementManager.getSpriteFrame(`${this._monsterInfo.spriteId}_${i}`));
//             }
//             let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 8);
//             clip.name = this._monsterInfo.spriteId;
//             clip.wrapMode = cc.WrapMode.Loop;
//             this.animation.addClip(clip);
//         }
//
//         this.animation.play(this._monsterInfo.spriteId);
//     }
//
//     hurt(damage: number) {
//         this._monsterInfo.hp = Util.clamp(this._monsterInfo.hp - damage, 0, Number.MAX_VALUE);
//         return this._monsterInfo.hp == 0;
//     }
//
//     movePath(path: cc.Vec2[], speed: number = 1) {
//         return new Promise(resolve => {
//             let moveActions = [];
//             path.forEach(position => {
//                 moveActions.push(cc.moveTo(this.globalInfo.npcSpeed * speed, position));
//             });
//             moveActions.push(
//                 cc.callFunc(() => {
//                     resolve();
//                 })
//             );
//             cc.tween(this.node)
//                 .sequence(moveActions)
//                 .call(() => {
//                     resolve();
//                 })
//                 .start();
//         });
//     }
//
//     beAttack() {
//         let icon = ElementManager.getCommon("attack");
//         icon.parent = this.node;
//         icon.position = cc.Vec3.ZERO;
//         cc.tween(icon)
//             .delay(this.globalInfo.fadeInterval)
//             .removeSelf()
//             .start();
//     }
//
//     move(vec: cc.Vec2, callback: any) {
//         cc.tween(this.node)
//             .by(this.globalInfo.npcSpeed, { position: vec })
//             .call(callback)
//             .start();
//     }
//
//     weak(ratio: number) {
//         this._monsterInfo.attack *= ratio;
//         this._monsterInfo.defence *= ratio;
//         this._monsterInfo.hp *= ratio;
//     }
//
//     isBoss() {
//         return this._monsterInfo.boss;
//     }
// }
