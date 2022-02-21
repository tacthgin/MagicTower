import { Component, tween, UIOpacity, v3, Vec3, _decorator } from "cc";
import { GameFrameworkLog } from "../../../../GameFramework/Scripts/Base/Log/GameFrameworkLog";
const { ccclass, property } = _decorator;

/** 上下左右 */
const directionDiffs: number[] = [-11, 11, -1, 1];
const positions: Vec3[] = [v3(0, 8), v3(0, -8), v3(-8, 0), v3(8, 0)];
const angles: number[] = [0, 180, 90, 270];

@ccclass("Lightning")
export class Lightning extends Component {
    init(directionDiff: number) {
        let index = directionDiffs.indexOf(directionDiff);
        if (index != -1) {
            this.node.position = positions[index];
            this.node.angle = angles[index];
            let uiOpacity = this.node.getComponent(UIOpacity);
            tween(uiOpacity).to(0.5, { opacity: 0 }).start();
        } else {
            GameFrameworkLog.error("Lightning direction error");
        }
    }
}
