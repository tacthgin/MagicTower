import { _decorator, Animation, Vec2 } from "cc";
const { ccclass } = _decorator;

import MapElement from "./MapElement";
import { ElementManager } from "../ElementManager";
import { DataManager } from "../../../Managers/DataManager";

@ccclass("Npc")
export class Npc extends MapElement {
    private _npcInfo: any = null;
    private stepIndex: number = 0;
    private moveIndex: number = 0;
    private animation: Animation | null = null;
    private globalInfo: any = null;
    get npcInfo() {
        //return this._npcInfo;
    }
    get onceStep() {
        //return this._npcInfo.talk.length == 1;
    }
    onLoad() {
        //this.animation = this.getComponent(cc.Animation);
        //this.globalInfo = DataManager.getJson("global");
    }
    start() {
        //this.createAnimation();
    }
    init(id: number) {
        //this._npcInfo = DataManager.getJsonElement("npc", id, true);
        //this.getComponent(cc.Sprite).spriteFrame = ElementManager.getSpriteFrame(`${this._npcInfo.spriteId}_0`);
        //this.createAnimation();
        //this.stepIndex = 0;
        //this.moveIndex = 0;
    }
    private createAnimation() {
        //if (!this.animation) return;
        //if (
        //this.animation.getClips().filter(value => {
        //return value.name == this._npcInfo.spriteId;
        //}).length == 0
        //) {
        //let spriteFrames = [];
        //for (let i = 0; i < 2; i++) {
        //spriteFrames.push(ElementManager.getSpriteFrame(`${this._npcInfo.spriteId}_${i}`));
        //}
        //let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 4);
        //clip.name = this._npcInfo.spriteId;
        //clip.wrapMode = cc.WrapMode.Loop;
        //this.animation.addClip(clip);
        //}
        //this.animation.play(this._npcInfo.spriteId);
    }
    talk() {
        //if (this._npcInfo.eventTalk) {
        //return { talk: this._npcInfo.eventTalk, index: "event" };
        //}
        //return { talk: this._npcInfo.talk[this.stepIndex], index: this.stepIndex };
    }
    nextTalk() {
        //if (!this._npcInfo.unlimit) {
        //++this.stepIndex;
        //}
    }
    move() {
        //if (this._npcInfo.move) {
        //return this._npcInfo.move[this.moveIndex++] || null;
        //}
        //return null;
    }
    movePath(path: Vec2[]) {
        //return new Promise(resolve => {
        //let moveActions = [];
        //path.forEach(position => {
        //moveActions.push(cc.moveTo(this.globalInfo.npcSpeed, position));
        //});
        //moveActions.push(
        //cc.callFunc(() => {
        //resolve();
        //})
        //);
        //this.node.runAction(cc.sequence(moveActions));
        //});
    }
    getWallIndex() {
        //if (this._npcInfo.wall) {
        //return this._npcInfo.wall[this.moveIndex] || null;
        //}
        //return null;
    }
    talkEnd() {
        //return this.stepIndex >= this._npcInfo.talk.length;
    }
    moveEnd() {
        //if (this._npcInfo.move) {
        //return this.moveIndex >= this._npcInfo.move.length;
        //}
        //return false;
    }
    consumeProp() {
        //if (this._npcInfo.unlimit) return;
        //if (this._npcInfo.value.prop) {
        //this._npcInfo.value.prop = null;
        //}
        //if (this._npcInfo.value.hp) {
        //this._npcInfo.value.hp = null;
        //}
    }
    canTrade() {
        //return this._npcInfo.value && (this._npcInfo.value.prop || this._npcInfo.value.hp);
    }
    clearEvent() {
        //this._npcInfo.eventTalk = null;
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import MapElement from "./MapElement";
// import { ElementManager } from "../ElementManager";
// import { DataManager } from "../../../Managers/DataManager";
//
// const { ccclass } = cc._decorator;
//
// @ccclass
// export class Npc extends MapElement {
//     private _npcInfo: any = null;
//
//     private stepIndex: number = 0;
//
//     private moveIndex: number = 0;
//
//     private animation: cc.Animation = null;
//
//     private globalInfo: any = null;
//
//     get npcInfo() {
//         return this._npcInfo;
//     }
//
//     get onceStep() {
//         return this._npcInfo.talk.length == 1;
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
//         this._npcInfo = DataManager.getJsonElement("npc", id, true);
//         this.getComponent(cc.Sprite).spriteFrame = ElementManager.getSpriteFrame(`${this._npcInfo.spriteId}_0`);
//         this.createAnimation();
//         this.stepIndex = 0;
//         this.moveIndex = 0;
//     }
//
//     private createAnimation() {
//         if (!this.animation) return;
//         if (
//             this.animation.getClips().filter(value => {
//                 return value.name == this._npcInfo.spriteId;
//             }).length == 0
//         ) {
//             let spriteFrames = [];
//             for (let i = 0; i < 2; i++) {
//                 spriteFrames.push(ElementManager.getSpriteFrame(`${this._npcInfo.spriteId}_${i}`));
//             }
//             let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 4);
//             clip.name = this._npcInfo.spriteId;
//             clip.wrapMode = cc.WrapMode.Loop;
//             this.animation.addClip(clip);
//         }
//         this.animation.play(this._npcInfo.spriteId);
//     }
//
//     talk() {
//         if (this._npcInfo.eventTalk) {
//             return { talk: this._npcInfo.eventTalk, index: "event" };
//         }
//
//         return { talk: this._npcInfo.talk[this.stepIndex], index: this.stepIndex };
//     }
//
//     nextTalk() {
//         if (!this._npcInfo.unlimit) {
//             ++this.stepIndex;
//         }
//     }
//
//     move() {
//         if (this._npcInfo.move) {
//             return this._npcInfo.move[this.moveIndex++] || null;
//         }
//         return null;
//     }
//
//     movePath(path: cc.Vec2[]) {
//         return new Promise(resolve => {
//             let moveActions = [];
//             path.forEach(position => {
//                 moveActions.push(cc.moveTo(this.globalInfo.npcSpeed, position));
//             });
//             moveActions.push(
//                 cc.callFunc(() => {
//                     resolve();
//                 })
//             );
//             this.node.runAction(cc.sequence(moveActions));
//         });
//     }
//
//     getWallIndex() {
//         if (this._npcInfo.wall) {
//             return this._npcInfo.wall[this.moveIndex] || null;
//         }
//         return null;
//     }
//
//     talkEnd() {
//         return this.stepIndex >= this._npcInfo.talk.length;
//     }
//
//     moveEnd() {
//         if (this._npcInfo.move) {
//             return this.moveIndex >= this._npcInfo.move.length;
//         }
//         return false;
//     }
//
//     consumeProp() {
//         if (this._npcInfo.unlimit) return;
//         if (this._npcInfo.value.prop) {
//             this._npcInfo.value.prop = null;
//         }
//
//         if (this._npcInfo.value.hp) {
//             this._npcInfo.value.hp = null;
//         }
//     }
//
//     canTrade() {
//         return this._npcInfo.value && (this._npcInfo.value.prop || this._npcInfo.value.hp);
//     }
//
//     clearEvent() {
//         this._npcInfo.eventTalk = null;
//     }
// }
