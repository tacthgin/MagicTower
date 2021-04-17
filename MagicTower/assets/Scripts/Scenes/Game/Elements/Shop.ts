import { _decorator, Animation } from "cc";
const { ccclass, property } = _decorator;

import { ElementManager } from "../ElementManager";
import MapElement from "./MapElement";

@ccclass("Shop")
export class Shop extends MapElement {
    private animation: Animation | null = null;
    onLoad() {
        //this.animation = this.getComponent(cc.Animation);
        //this.createAnimation();
    }
    private createAnimation() {
        //let spriteFrames = [];
        //for (let i = 0; i < 2; i++) {
        //spriteFrames.push(ElementManager.getSpriteFrame(`pb_m_${i}`));
        //}
        //let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 8);
        //clip.wrapMode = cc.WrapMode.Loop;
        //clip.name = "shop";
        //this.animation.addClip(clip);
        //this.animation.play(clip.name);
    }
    init() {}
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import { ElementManager } from "../ElementManager";
// import MapElement from "./MapElement";
//
// const { ccclass, property } = cc._decorator;
//
// @ccclass
// export class Shop extends MapElement {
//     private animation: cc.Animation = null;
//
//     onLoad() {
//         this.animation = this.getComponent(cc.Animation);
//         this.createAnimation();
//     }
//
//     private createAnimation() {
//         let spriteFrames = [];
//         for (let i = 0; i < 2; i++) {
//             spriteFrames.push(ElementManager.getSpriteFrame(`pb_m_${i}`));
//         }
//         let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 8);
//         clip.wrapMode = cc.WrapMode.Loop;
//         clip.name = "shop";
//         this.animation.addClip(clip);
//         this.animation.play(clip.name);
//     }
//
//     init() {}
// }
