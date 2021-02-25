import { _decorator, Component, Animation } from 'cc';
const { ccclass } = _decorator;

import { DataManager } from "../../../Managers/DataManager";
import { ElementManager } from "../ElementManager";

@ccclass('MonsterIcon')
export default class MonsterIcon extends Component {
    private animation: Animation | null = null;
    private monsterInfo: any = null;
    onLoad() {
        //this.animation = this.getComponent(cc.Animation);
    }
    start() {
        //this.createAnimation();
    }
    init(id: number) {
        //this.monsterInfo = DataManager.getJsonElement("monster", id, true);
        //this.getComponent(cc.Sprite).spriteFrame = ElementManager.getSpriteFrame(`${this.monsterInfo.spriteId}_0`);
        //this.createAnimation();
    }
    private createAnimation() {
        //if (!this.animation) return;
        //if (
        //this.animation.getClips().filter(value => {
        //return value.name == this.monsterInfo.spriteId;
        //}).length == 0
        //) {
        //let spriteFrames = [];
        //for (let i = 0; i < 2; i++) {
        //spriteFrames.push(ElementManager.getSpriteFrame(`${this.monsterInfo.spriteId}_${i}`));
        //}
        //let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 8);
        //clip.name = this.monsterInfo.spriteId;
        //clip.wrapMode = cc.WrapMode.Loop;
        //this.animation.addClip(clip);
        //}

        //this.animation.play(this.monsterInfo.spriteId);
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import { DataManager } from "../../../Managers/DataManager";
// import { ElementManager } from "../ElementManager";
// 
// const { ccclass } = cc._decorator;
// 
// @ccclass
// export default class MonsterIcon extends cc.Component {
//     private animation: cc.Animation = null;
// 
//     private monsterInfo: any = null;
// 
//     onLoad() {
//         this.animation = this.getComponent(cc.Animation);
//     }
// 
//     start() {
//         this.createAnimation();
//     }
// 
//     init(id: number) {
//         this.monsterInfo = DataManager.getJsonElement("monster", id, true);
//         this.getComponent(cc.Sprite).spriteFrame = ElementManager.getSpriteFrame(`${this.monsterInfo.spriteId}_0`);
//         this.createAnimation();
//     }
// 
//     private createAnimation() {
//         if (!this.animation) return;
//         if (
//             this.animation.getClips().filter(value => {
//                 return value.name == this.monsterInfo.spriteId;
//             }).length == 0
//         ) {
//             let spriteFrames = [];
//             for (let i = 0; i < 2; i++) {
//                 spriteFrames.push(ElementManager.getSpriteFrame(`${this.monsterInfo.spriteId}_${i}`));
//             }
//             let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 8);
//             clip.name = this.monsterInfo.spriteId;
//             clip.wrapMode = cc.WrapMode.Loop;
//             this.animation.addClip(clip);
//         }
// 
//         this.animation.play(this.monsterInfo.spriteId);
//     }
// }
