import { IAstarHelp } from "../IAstarHelp";
import { IVec2 } from "../IVec2";

/**
 * 走十字格子的A*辅助器
 */
export class CrossAstarHelp implements IAstarHelp {
    static s_roundNodes: Array<IVec2> = new Array<IVec2>({ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 });

    estimate(currentPosition: IVec2, endPosition: IVec2): number {
        return Math.abs(endPosition.y - currentPosition.y) + Math.abs(endPosition.x - currentPosition.x);
    }

    forEachAroundNodes(callbackfn: (position: IVec2) => void, thisArg?: any): void {
        CrossAstarHelp.s_roundNodes.forEach((position: IVec2) => {
            callbackfn.call(thisArg, position);
        });
    }
}
