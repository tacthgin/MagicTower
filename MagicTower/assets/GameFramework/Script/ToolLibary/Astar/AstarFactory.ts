import { Astar } from "./Astar";
import { CrossAstarHelp } from "./AstarHelp/CrossAstarHelp";
import { EightDirectionAstarHelp } from "./AstarHelp/EightDirectionAstarHelp";
import { IAstar } from "./IAstar";
import { IAstarHelp } from "./IAstarHelp";
import { IAstarMap } from "./IAstarMap";

/**
 * A*工厂
 */
export class AstarFactory {
    /**
     * 走十字格子的A*
     * @param astarMap 地图
     * @returns
     */
    static createCrossAstar(astarMap: IAstarMap): IAstar {
        return this.createCustomAstar(astarMap, new CrossAstarHelp());
    }

    /**
     * 走八方向格子的A*
     * @param astarMap 地图
     * @returns
     */
    static createEightDirectionAstar(astarMap: IAstarMap): IAstar {
        return this.createCustomAstar(astarMap, new EightDirectionAstarHelp());
    }

    /**
     * 自定义的A*
     * @param astarMap 地图
     * @param astarHelp A*辅助器
     * @returns
     */
    static createCustomAstar(astarMap: IAstarMap, astarHelp: IAstarHelp): IAstar {
        let astar = new Astar(astarMap);
        astar.setAstarHelp(astarHelp);
        return astar;
    }
}
