import { _decorator, Animation } from "cc";
const { ccclass, property } = _decorator;

import { DataManager } from "../../../Managers/DataManager";
import { ElementManager } from "../ElementManager";
import MapElement from "./MapElement";
import { NotifyCenter } from "../../../Managers/NotifyCenter";
import { GameEvent } from "../../Constant/GameEvent";

@ccclass("Door")
export default class Door extends MapElement {
    private doorInfo: any = null;
    /** 被动的墙 */
    private _passive: boolean = false;
    /** 点击出现的墙 */
    private _appear: boolean = false;
    /** 隐藏的墙 */
    private _hide: boolean = false;
    /** 开门条件 */
    private _condition: boolean = null;
    private animation: Animation | null = null;
    get id() {
        //return this.doorInfo.id;
    }
    set passive(value) {
        //this._passive = value;
    }
    get passive() {
        //return this._passive;
    }
    set appear(value) {
        //this.node.active = false;
        //this._appear = value;
    }
    get appear() {
        //return this._appear;
    }
    set hide(value) {
        //this.node.active = false;
        //this._hide = value;
    }
    get hide() {
        //return this._hide;
    }
    set condition(value) {
        //this._condition = value;
    }
    get condition() {
        //return this._condition;
    }
    onLoad() {
        //this.animation = this.getComponent(cc.Animation);
        //this.animation.on("finished", this.onFinished, this);
    }
    init(id: number) {
        //this._passive = false;
        //this._appear = false;
        //this._hide = false;
        //this.doorInfo = DataManager.getJsonElement("door", id);
        //this.getComponent(cc.Sprite).spriteFrame = ElementManager.getSpriteFrame(`${this.doorInfo.spriteId}_0`);
    }
    private onFinished() {
        //if (this.animation.currentClip.name != `${this.doorInfo.spriteId}_reverse`) {
        //this.pool.put(this.node);
        //if (!this._passive) {
        //NotifyCenter.emit(GameEvent.ELEMENT_ACTION_COMPLETE);
        //}
        //} else if (this._hide) {
        //this._hide = false;
        //NotifyCenter.emit(GameEvent.ELEMENT_ACTION_COMPLETE);
        //}
    }
    private playAnimation(reverse: boolean) {
        //if (!this.animation) return;
        //let name = reverse ? `${this.doorInfo.spriteId}_reverse` : this.doorInfo.spriteId;
        //if (
        //this.animation.getClips().filter(value => {
        //return value.name == name;
        //}).length == 0
        //) {
        //let spriteFrames = [];
        //for (let i = 0; i < 4; i++) {
        //spriteFrames.push(ElementManager.getSpriteFrame(`${this.doorInfo.spriteId}_${i}`));
        //}
        //if (reverse) {
        //spriteFrames.reverse();
        //}
        //let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 17);
        //clip.name = name;
        //clip.wrapMode = cc.WrapMode.Normal;
        //this.animation.addClip(clip);
        //}
        //this.animation.play(name);
    }
    add() {
        //this.node.active = true;
        //this.playAnimation(true);
    }
    remove() {
        //this.playAnimation(false);
    }
    canWallOpen() {
        //return !this._passive && this.doorInfo.id == 1006 && !this._appear && !this._condition;
    }
    isYellow() {
        //return this.doorInfo.id == 1001;
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import { DataManager } from "../../../Managers/DataManager";
// import { ElementManager } from "../ElementManager";
// import MapElement from "./MapElement";
// import { NotifyCenter } from "../../../Managers/NotifyCenter";
// import { GameEvent } from "../../../Constant/GameEvent";
//
// const { ccclass, property } = cc._decorator;
//
// @ccclass
// export default class Door extends MapElement {
//     private doorInfo: any = null;
//
//     /** 被动的墙 */
//     private _passive: boolean = false;
//
//     /** 点击出现的墙 */
//     private _appear: boolean = false;
//
//     /** 隐藏的墙 */
//     private _hide: boolean = false;
//
//     /** 开门条件 */
//     private _condition: boolean = null;
//
//     private animation: cc.Animation = null;
//
//     get id() {
//         return this.doorInfo.id;
//     }
//
//     set passive(value) {
//         this._passive = value;
//     }
//
//     get passive() {
//         return this._passive;
//     }
//
//     set appear(value) {
//         this.node.active = false;
//         this._appear = value;
//     }
//
//     get appear() {
//         return this._appear;
//     }
//
//     set hide(value) {
//         this.node.active = false;
//         this._hide = value;
//     }
//
//     get hide() {
//         return this._hide;
//     }
//
//     set condition(value) {
//         this._condition = value;
//     }
//
//     get condition() {
//         return this._condition;
//     }
//
//     onLoad() {
//         this.animation = this.getComponent(cc.Animation);
//         this.animation.on("finished", this.onFinished, this);
//     }
//
//     init(id: number) {
//         this._passive = false;
//         this._appear = false;
//         this._hide = false;
//         this.doorInfo = DataManager.getJsonElement("door", id);
//         this.getComponent(cc.Sprite).spriteFrame = ElementManager.getSpriteFrame(`${this.doorInfo.spriteId}_0`);
//     }
//
//     private onFinished() {
//         if (this.animation.currentClip.name != `${this.doorInfo.spriteId}_reverse`) {
//             this.pool.put(this.node);
//             if (!this._passive) {
//                 NotifyCenter.emit(GameEvent.ELEMENT_ACTION_COMPLETE);
//             }
//         } else if (this._hide) {
//             this._hide = false;
//             NotifyCenter.emit(GameEvent.ELEMENT_ACTION_COMPLETE);
//         }
//     }
//
//     private playAnimation(reverse: boolean) {
//         if (!this.animation) return;
//
//         let name = reverse ? `${this.doorInfo.spriteId}_reverse` : this.doorInfo.spriteId;
//
//         if (
//             this.animation.getClips().filter(value => {
//                 return value.name == name;
//             }).length == 0
//         ) {
//             let spriteFrames = [];
//             for (let i = 0; i < 4; i++) {
//                 spriteFrames.push(ElementManager.getSpriteFrame(`${this.doorInfo.spriteId}_${i}`));
//             }
//             if (reverse) {
//                 spriteFrames.reverse();
//             }
//             let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 17);
//             clip.name = name;
//             clip.wrapMode = cc.WrapMode.Normal;
//             this.animation.addClip(clip);
//         }
//
//         this.animation.play(name);
//     }
//
//     add() {
//         this.node.active = true;
//         this.playAnimation(true);
//     }
//
//     remove() {
//         this.playAnimation(false);
//     }
//
//     canWallOpen() {
//         return !this._passive && this.doorInfo.id == 1006 && !this._appear && !this._condition;
//     }
//
//     isYellow() {
//         return this.doorInfo.id == 1001;
//     }
// }
