import { _decorator, Vec3, v3 } from 'cc';
const { ccclass, property } = _decorator;

import { DataManager } from "../../../Managers/DataManager";
import MapElement from "./MapElement";

@ccclass('Lightning')
export default class Lightning extends MapElement {
    /** 上下左右 */
    private directionDiffs: number[] = [-11, 11, -1, 1];
    private positions: cc.Vec3[] = [v3(0, 8), v3(0, -8), v3(-8, 0), v3(8, 0)];
    private angles: number[] = [0, 180, 90, 270];
    init(directionDiff: number) {
        //let index = this.directionDiffs.indexOf(directionDiff);
        //if (index != -1) {
        //this.node.position = this.positions[index];
        //this.node.angle = this.angles[index];
        //this.remove();
        //} else {
        //cc.warn("direction error");
        //}
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import { DataManager } from "../../../Managers/DataManager";
// import MapElement from "./MapElement";
// 
// const { ccclass, property } = cc._decorator;
// 
// @ccclass
// export default class Lightning extends MapElement {
//     /** 上下左右 */
//     private directionDiffs: number[] = [-11, 11, -1, 1];
// 
//     private positions: cc.Vec3[] = [cc.v3(0, 8), cc.v3(0, -8), cc.v3(-8, 0), cc.v3(8, 0)];
// 
//     private angles: number[] = [0, 180, 90, 270];
// 
//     init(directionDiff: number) {
//         let index = this.directionDiffs.indexOf(directionDiff);
//         if (index != -1) {
//             this.node.position = this.positions[index];
//             this.node.angle = this.angles[index];
//             this.remove();
//         } else {
//             cc.warn("direction error");
//         }
//     }
// }
