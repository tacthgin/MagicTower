import { AstarNode } from "./AstarNode";
import { IAstar } from "./IAstar";
import { IAstarHelp } from "./IAstarHelp";
import { IAstarMap } from "./IAstarMap";
import { IVec2 } from "./IVec2";

export class Astar implements IAstar {
    /** 关闭列表的节点不会在用到 */
    private readonly _closeList: Set<number> = null!;
    /** 从开放列表取估值最小的路径来行走 */
    private readonly _openList: Array<AstarNode> = null!;
    /** 是否缓存在开放列表中 */
    private readonly _cachedOpenList: Set<number> = null!;
    /** A*地图 */
    private _astarMap: IAstarMap = null!;
    /** A*辅助器 */
    private _astarHelp: IAstarHelp | null = null;
    /** 暂时缓存节点 */
    private readonly _cachedAstarNodes: Array<AstarNode> = null!;
    /** 已经释放的节点 */
    private readonly _releasedAstarNodes: Array<AstarNode> = null!;

    constructor(astarMap: IAstarMap) {
        this._astarMap = astarMap;
        this._closeList = new Set<number>();
        this._openList = new Array<AstarNode>();
        this._cachedOpenList = new Set<number>();
        this._cachedAstarNodes = new Array<AstarNode>();
        this._releasedAstarNodes = new Array<AstarNode>();
    }

    /**
     * 缓存的节点个数
     */
    get astarNodeCount(): number {
        return this._releasedAstarNodes.length;
    }

    /**
     * 设置A*辅助器
     * @param astarHelp
     */
    setAstarHelp(astarHelp: IAstarHelp): void {
        this._astarHelp = astarHelp;
    }

    /**
     * 创建路径
     * @param beginPosition 起始位置
     * @param endPosition 终点位置
     * @returns 路径列表
     */
    makePath(beginPosition: IVec2, endPosition: IVec2): Array<IVec2> {
        if (!this._astarHelp) {
            throw new Error("astar help not exist");
        }

        if (!this.inBoundary(beginPosition)) {
            throw new Error("begin position out of boundary");
        }

        if (!this.inBoundary(endPosition)) {
            throw new Error("end position out of boundary");
        }

        let hValue = this._astarHelp.estimate(beginPosition, endPosition);
        if (hValue == 0) {
            throw new Error("distance is 0");
        }

        this.clear();

        this.addToOpenList(this.positionToIndex(beginPosition), beginPosition, hValue, null);

        let node: AstarNode | null = null;
        let lastNode: AstarNode | null = null;

        while ((node = this.popOpenList())) {
            if (node.equals(endPosition)) {
                lastNode = node;
                break;
            }
            this.addAroundNodes(node, endPosition);
        }

        let path = new Array<IVec2>();

        // 判断父亲是不包含起点
        while (lastNode && lastNode.parent) {
            path.push(lastNode.position);
            lastNode = lastNode.parent;
        }
        //路径反转
        path.reverse();
        //回收节点
        this.recyle();

        return path;
    }

    /**
     * 清除缓存的节点
     */
    clearCacheNodes(): void {
        this._releasedAstarNodes.length = 0;
    }

    /**
     * 清除开放和关闭列表
     */
    private clear(): void {
        this._openList.length = 0;
        this._closeList.clear();
        this._cachedOpenList.clear();
    }

    /**
     * 回收节点
     */
    private recyle(): void {
        this._cachedAstarNodes.forEach((node) => {
            this._releasedAstarNodes.push(node);
        });
        this._cachedAstarNodes.length = 0;
        this._openList.forEach((node) => {
            this._releasedAstarNodes.push(node);
        });
        this._openList.length = 0;
    }

    /**
     * 位置是否在地图范围
     * @param position
     * @returns
     */
    private inBoundary(position: IVec2): boolean {
        return position.x >= 0 && position.x < this._astarMap.width && position.y >= 0 && position.y < this._astarMap.height;
    }

    /**
     * 位置转换为唯一索引
     * @param position
     * @returns
     */
    private positionToIndex(position: IVec2): number {
        return position.y * this._astarMap.width + position.x;
    }

    /**
     * 添加位置到关闭列表
     * @param index
     */
    private addIndexToCloseList(index: number): void {
        if (!this._closeList.has(index)) {
            this._closeList.add(index);
        } else {
            throw new Error(`index ${index} has exist in close list`);
        }
    }

    /**
     * 插入节点到开放列表，并按f值排序
     * @param index 节点唯一索引
     * @param position 节点位置
     * @param hValue 节点预估值
     * @param parentNode 父节点
     */
    private addToOpenList(index: number, position: IVec2, hValue: number, parentNode: AstarNode | null = null): void {
        let node = this.acquireAstarNode(index, position, hValue, parentNode);
        let openListIndex = 0;
        for (let i = this._openList.length - 1; i >= 0; --i) {
            if (node.fValue < this._openList[i].fValue) {
                openListIndex = i + 1;
                break;
            }
        }
        this._openList.splice(openListIndex, 0, node);
        this._cachedOpenList.add(index);
    }

    /**
     * 从开放列表取出估值最小的节点
     * @returns
     */
    private popOpenList(): AstarNode | null {
        let astarNode = this._openList.pop();
        if (astarNode) {
            let index = this.positionToIndex(astarNode.position);
            this._cachedOpenList.delete(index);
            this._cachedAstarNodes.push(astarNode);
            return astarNode;
        }
        return null;
    }

    /**
     * 添加当前节点周围的节点
     * @param currentNode 当前节点
     * @param endPosition 终点位置
     */
    private addAroundNodes(currentNode: AstarNode, endPosition: IVec2): void {
        this.addIndexToCloseList(currentNode.index);

        this._astarHelp!.forEachAroundNodes((position: IVec2) => {
            let newPos: IVec2 = { x: currentNode.position.x + position.x, y: currentNode.position.y + position.y };
            if (this.inBoundary(newPos)) {
                //在地图范围内
                let index = this.positionToIndex(newPos);
                if (!this._closeList.has(index) && !this._cachedOpenList.has(index)) {
                    //不在关闭列表和开放列表中
                    if (this._astarMap.check(newPos)) {
                        //地图测试通过，就加入开放列表
                        this.addToOpenList(index, newPos, this._astarHelp!.estimate(newPos, endPosition), currentNode);
                    } else {
                        this.addIndexToCloseList(index);
                    }
                }
            }
        });
    }

    /**
     * 生成A*节点
     * @param index 节点唯一索引
     * @param position 节点位置
     * @param hValue 节点的预估值
     * @param parentNode 父节点
     * @returns
     */
    private acquireAstarNode(index: number, position: IVec2, hValue: number, parentNode: AstarNode | null = null): AstarNode {
        if (this._releasedAstarNodes.length > 0) {
            let node = this._releasedAstarNodes.pop()!;
            node.initialize(index, position, hValue, parentNode);
            return node;
        } else {
            return new AstarNode(index, position, hValue, parentNode);
        }
    }
}
