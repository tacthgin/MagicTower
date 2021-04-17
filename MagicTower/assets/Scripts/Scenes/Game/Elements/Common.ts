import { _decorator, Animation } from "cc";
const { ccclass } = _decorator;

import MapElement from "./MapElement";
import { ElementManager } from "../ElementManager";

@ccclass("Common")
export class Common extends MapElement {
    private animation: Animation | null = null;
    private elementName: string = null;
    onLoad() {
        //this.animation = this.getComponent(cc.Animation);
    }
    init(name: string) {
        //this.elementName = name;
        //if (this.elementName.indexOf("fire") != -1 || this.elementName.indexOf("star") != -1) {
        //this.createAnimation();
        //} else {
        //this.animation.stop();
        //}
        //this.getComponent(cc.Sprite).spriteFrame = ElementManager.getSpriteFrame(this.elementName);
    }
    remove() {
        //super.remove(true);
    }
    add() {}
    private createAnimation() {
        //if (!this.animation) return;
        //if (
        //this.animation.getClips().filter((value) => {
        //return value.name == this.elementName;
        //}).length == 0
        //) {
        //let spriteFrames = [];
        //let prefix = this.elementName.substring(0, this.elementName.indexOf("_"));
        //for (let i = 0; i < 2; i++) {
        //spriteFrames.push(ElementManager.getSpriteFrame(`${prefix}_${i}`));
        //}
        //let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 8);
        //clip.name = this.elementName;
        //clip.wrapMode = cc.WrapMode.Loop;
        //this.animation.addClip(clip);
        //}
        //this.animation.play(this.elementName);
    }
    isWall() {
        //return this.elementName.indexOf("door") != -1;
    }
    isLava() {
        //return this.elementName.indexOf("fire") != -1;
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import MapElement from "./MapElement";
// import { ElementManager } from "../ElementManager";
//
// const { ccclass } = cc._decorator;
//
// @ccclass
// export class Common extends MapElement {
//     private animation: cc.Animation = null;
//
//     private elementName: string = null;
//
//     onLoad() {
//         this.animation = this.getComponent(cc.Animation);
//     }
//
//     init(name: string) {
//         this.elementName = name;
//         if (this.elementName.indexOf("fire") != -1 || this.elementName.indexOf("star") != -1) {
//             this.createAnimation();
//         } else {
//             this.animation.stop();
//         }
//         this.getComponent(cc.Sprite).spriteFrame = ElementManager.getSpriteFrame(this.elementName);
//     }
//
//     remove() {
//         super.remove(true);
//     }
//
//     add() {}
//
//     private createAnimation() {
//         if (!this.animation) return;
//         if (
//             this.animation.getClips().filter((value) => {
//                 return value.name == this.elementName;
//             }).length == 0
//         ) {
//             let spriteFrames = [];
//             let prefix = this.elementName.substring(0, this.elementName.indexOf("_"));
//             for (let i = 0; i < 2; i++) {
//                 spriteFrames.push(ElementManager.getSpriteFrame(`${prefix}_${i}`));
//             }
//             let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 8);
//             clip.name = this.elementName;
//             clip.wrapMode = cc.WrapMode.Loop;
//             this.animation.addClip(clip);
//         }
//
//         this.animation.play(this.elementName);
//     }
//
//     isWall() {
//         return this.elementName.indexOf("door") != -1;
//     }
//
//     isLava() {
//         return this.elementName.indexOf("fire") != -1;
//     }
// }
