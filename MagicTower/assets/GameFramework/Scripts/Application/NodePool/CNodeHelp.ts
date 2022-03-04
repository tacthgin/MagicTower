import { instantiate, Node } from "cc";
import { INodeHelp } from "../../NodePool/INodeHelp";

export class CNodeHelp implements INodeHelp {
    instantiateNode(asset: object): object {
        return instantiate(asset);
    }

    releaseNode(node: object): void {
        if ((node as Node).parent) {
            (node as Node).removeFromParent();
        }
    }
}
