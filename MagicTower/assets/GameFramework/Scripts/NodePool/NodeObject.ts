import { ReferencePool } from "../Base/ReferencePool/ReferencePool";
import { ObjectBase } from "../ObjectPool/ObjectBase";
import { INodeHelper } from "./INodeHelper";

/**
 * 节点对象
 */
export class NodeObject extends ObjectBase {
    private _nodeHelper: INodeHelper = null!;

    static create(name: string, node: object, nodeHelper: INodeHelper): NodeObject {
        let nodeObejct = ReferencePool.acquire(NodeObject);
        nodeObejct.initialize(name, node);
        nodeObejct._nodeHelper = nodeHelper;
        return nodeObejct;
    }

    onUnspawn(): void {
        this._nodeHelper.releaseNode(this.target);
    }

    clear(): void {
        super.clear();
        this._nodeHelper.releaseNode(this.target);
        this._nodeHelper = null!;
    }
}
