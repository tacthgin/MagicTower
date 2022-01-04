import { IVec2 } from "../../Base/GameStruct/IVec2";
import { IAstarHelp } from "./IAstarHelp";

/**
 * A*接口
 */
export interface IAstar {
    /**
     * 缓存的节点个数
     */
    readonly astarNodeCount: number;

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
