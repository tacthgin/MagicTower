import { Node, Tween } from "cc";
import { DialogActionFactory } from "../../DialogActionFactory";
import { DialogAction } from "../DialogAction";
import { DialogActionBase } from "../DialogActionBase";

@DialogActionFactory.registerAction(DialogAction.NoneAction)
export class NoneAction extends DialogActionBase {
    protected getStartAction(node: Node): Tween<Node> | null {
        return null;
    }

    protected getEndAction(node: Node): Tween<Node> | null {
        return null;
    }
}
