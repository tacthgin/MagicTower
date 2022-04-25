/**
 * 节点辅助器接口
 */
export interface INodeHelper {
    /**
     * 实例化节点
     * @param asset 节点资源
     * @returns 实例化的节点
     */
    instantiateNode(asset: object): object;

    /**
     * 释放节点
     * @param node 节点
     */
    releaseNode(node: object): void;
}
