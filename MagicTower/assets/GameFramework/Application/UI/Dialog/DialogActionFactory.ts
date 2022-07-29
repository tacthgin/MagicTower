import { Constructor, Node } from "cc";
import { GameFrameworkError } from "../../../Script/Base/GameFrameworkError";
import { ReferencePool } from "../../../Script/Base/ReferencePool/ReferencePool";
import { DialogAction } from "./DialogAction/DialogAction";
import { DialogActionBase } from "./DialogAction/DialogActionBase";

export class DialogActionFactory {
    private static readonly s_dialogActionConstructors: Map<DialogAction, Constructor<DialogActionBase>> = new Map<DialogAction, Constructor<DialogActionBase>>();

    static registerAction(dialogAction: DialogAction) {
        return (target: Constructor<DialogActionBase>) => {
            this.s_dialogActionConstructors.set(dialogAction, target);
        };
    }

    static getAction(dialogAction: DialogAction, dialogActionNode: Node, endActionCallback: () => void): DialogActionBase {
        let constructor = this.s_dialogActionConstructors.get(dialogAction);
        if (!constructor) {
            constructor = this.s_dialogActionConstructors.get(DialogAction.NoneAction);
            if (!constructor) {
                throw new GameFrameworkError("you must register none action");
            }
        }

        let dialogActionObject = ReferencePool.acquire(constructor as Constructor<DialogActionBase>);
        dialogActionObject.initialize(dialogActionNode, endActionCallback);
        return dialogActionObject;
    }
}
