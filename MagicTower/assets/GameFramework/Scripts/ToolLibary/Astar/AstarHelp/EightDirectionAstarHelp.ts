import { IAstarHelp } from "../IAstarHelp";
import { IVec2 } from "../IVec2";

/**
 * 八方向格子的A*辅助器
 */
export class EightDirectionAstarHelp implements IAstarHelp {
    static s_roundNodes: Array<IVec2> = new Array<IVec2>({ x: 0, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 1 }, { x: -1, y: 0 }, { x: -1, y: -1 });

    estimate(currentPosition: IVec2, endPosition: IVec2): number {
        let y = endPosition.y - currentPosition.y;
        let x = endPosition.x - currentPosition.x;
        return Math.sqrt(x * x + y * y);
    }

    forEachAroundNodes(callbackfn: (position: IVec2) => void, thisArg?: any): void {
        EightDirectionAstarHelp.s_roundNodes.forEach((position: IVec2) => {
            callbackfn.call(thisArg, position);
        });
    }
}
