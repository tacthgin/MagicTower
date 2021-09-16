import { _decorator, Vec3, v3, tween, UIOpacity } from "cc";
import { BasePoolNode } from "../../../../Framework/Base/BasePoolNode";
const { ccclass, property } = _decorator;

/** 上下左右 */
const directionDiffs: number[] = [-11, 11, -1, 1];
const positions: Vec3[] = [v3(0, 8), v3(0, -8), v3(-8, 0), v3(8, 0)];
const angles: number[] = [0, 180, 90, 270];

@ccclass("Lightning")
export class Lightning extends BasePoolNode {
    init(directionDiff: number) {
        let index = directionDiffs.indexOf(directionDiff);
        if (index != -1) {
            this.node.position = positions[index];
            this.node.angle = angles[index];
            let uiOpacity = this.node.getComponent(UIOpacity);
            tween(uiOpacity).to(0.1, { opacity: 0 }).start();
        } else {
            console.warn("direction error");
        }
    }
}
