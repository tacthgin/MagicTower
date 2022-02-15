import { Node, Tween } from "cc";
import { DialogActionBase } from "../DialogActionBase";

export class NoneAction extends DialogActionBase {
    protected getStartAction(node: Node): Tween<Node> | null {
        return null;
    }

    protected getEndAction(node: Node): Tween<Node> | null {
        return null;
    }
}
