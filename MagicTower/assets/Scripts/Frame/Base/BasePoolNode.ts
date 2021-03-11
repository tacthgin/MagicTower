import { Component, instantiate, Node, NodePool, Prefab, _decorator } from "cc";
const { ccclass } = _decorator;

/** 对象池节点 */
@ccclass("BasePoolNode")
export class BasePoolNode extends Component {
    protected pool: NodePool = null;

    static generateNodeFromPool(pool: NodePool, prefab: Prefab) {
        if (!pool || !prefab) return null;

        let node: Node = null;
        if (pool.size() == 0) {
            node = instantiate(prefab);
            pool.put(node);
        }
        return pool.get(pool);
    }

    reuse(pool: NodePool) {
        this.pool = pool;
    }

    remove() {
        if (this.pool) {
            this.pool.put(this.node);
        } else {
            this.node.destroy();
        }
    }

    removeAllPoolNode() {
        this.node.children.forEach((node: Node) => {
            let poolNode = node.getComponent(BasePoolNode);
            if (poolNode) {
                poolNode.removeAllPoolNode();
                poolNode.remove();
            }
        });
    }
}
