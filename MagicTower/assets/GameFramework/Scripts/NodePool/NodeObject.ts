import { ReferencePool } from "../Base/ReferencePool/ReferencePool";
import { ObjectBase } from "../ObjectPool/ObjectBase";
import { INodeHelp } from "./INodeHelp";

/**
 * 节点对象
 */
export class NodeObject extends ObjectBase {
    private _nodeHelper: INodeHelp = null!;

    static create(name: string, node: object, nodeHelp: INodeHelp): NodeObject {
        let nodeObejct = ReferencePool.acquire(NodeObject);
        nodeObejct.initialize(name, node);
        nodeObejct._nodeHelper = nodeHelp;
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
