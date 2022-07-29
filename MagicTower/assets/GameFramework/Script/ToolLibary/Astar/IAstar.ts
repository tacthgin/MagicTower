import { IVec2 } from "../../Base/GameStruct/IVec2";
import { IAstarHelp } from "./IAstarHelp";
import { IAstarMap } from "./IAstarMap";

/**
 * A*接口
 */
export interface IAstar {
    /**
     * 缓存的节点个数
     */
    readonly astarNodeCount: number;

    /**
     * 设置A*地图
     * @param astarMap 地图
     */
    setAstarMap(astarMap: IAstarMap): void;

    /**
     * 设置A*辅助器
     * @param astarHelp
     */
    setAstarHelp(astarHelp: IAstarHelp): void;

    /**
     * 创建路径
     * @param beginPosition 起始位置
     * @param endPosition 终点位置
     * @returns 路径列表
     */
    makePath(beginPosition: IVec2, endPosition: IVec2): Array<IVec2>;

    /**
     * 清除缓存的节点
     */
    clearCacheNodes(): void;
}
