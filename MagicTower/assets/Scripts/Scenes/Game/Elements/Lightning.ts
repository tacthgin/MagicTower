import { _decorator, Vec3, v3 } from "cc";
import { MapElement } from "./MapElement";
const { ccclass, property } = _decorator;

@ccclass("Lightning")
export class Lightning extends MapElement {
    /** 上下左右 */
    private directionDiffs: number[] = [-11, 11, -1, 1];
    private positions: Vec3[] = [v3(0, 8), v3(0, -8), v3(-8, 0), v3(8, 0)];
    private angles: number[] = [0, 180, 90, 270];

    init(directionDiff: number) {
        let index = this.directionDiffs.indexOf(directionDiff);
        if (index != -1) {
            this.node.position = this.positions[index];
            this.node.angle = this.angles[index];
            this.remove();
        } else {
            console.warn("direction error");
        }
    }
}
