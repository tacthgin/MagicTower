import { _decorator, Node, Button } from "cc";
import { DialogBase } from "../../GameFramework/Scripts/Application/UI/Dialog/DialogBase";

const { ccclass, property } = _decorator;

@ccclass("ArchiveDialog")
export class ArchiveDialog extends DialogBase {
    @property(Node)
    private saveNodes: Node[] = null!;

    onLoad() {}

    private onSaveButtonClick(button: Button, customEventData: string) {
        switch (customEventData) {
            case "save":
                break;
        }
    }
}
