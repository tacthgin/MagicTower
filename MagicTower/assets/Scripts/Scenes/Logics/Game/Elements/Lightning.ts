import { _decorator, Vec3, v3 } from "cc";
import { MapElement } from "./Base/MapElement";
const { ccclass, property } = _decorator;

/** 上下左右 */
const directionDiffs: number[] = [-11, 11, -1, 1];
const positions: Vec3[] = [v3(0, 8), v3(0, -8), v3(-8, 0), v3(8, 0)];
const angles: number[] = [0, 180, 90, 270];

@ccclass("Lightning")
export class Lightning extends MapElement {
    init(directionDiff: number) {
        let index = directionDiffs.indexOf(directionDiff);
        if (index != -1) {
            this.node.position = positions[index];
            this.node.angle = angles[index];
            this.remove();
        } else {
            console.warn("direction error");
        }
    }
}
