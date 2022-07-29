import { instantiate, Node } from "cc";
import { INodeHelper } from "../../Script/NodePool/INodeHelper";

export class CNodeHelper implements INodeHelper {
    instantiateNode(asset: object): object {
        return instantiate(asset);
    }

    releaseNode(node: object): void {
        if ((node as Node).parent) {
            (node as Node).removeFromParent();
        }
    }
}
