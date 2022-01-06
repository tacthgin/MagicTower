import { ReferencePool } from "../Base/ReferencePool/ReferencePool";
import { ObjectBase } from "../ObjectPool/ObjectBase";
import { INodeHelp } from "./INodeHelp";

export class NodeObject extends ObjectBase {
    private _nodeHelper: INodeHelp | null = null;

    static create(name: string, node: object, nodeHelp: INodeHelp): NodeObject {
        let nodeObejct = ReferencePool.acquire(NodeObject);
        nodeObejct.initialize(name, node);
        nodeObejct._nodeHelper = nodeHelp;
        return nodeObejct;
    }

    clear(): void {
        super.clear();
        this._nodeHelper = null;
    }
}
