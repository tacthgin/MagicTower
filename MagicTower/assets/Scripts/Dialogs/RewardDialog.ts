import { _decorator, Label, Node } from "cc";
import { DialogBase } from "../../GameFramework/Application/UI/Dialog/DialogBase";
import { Npc } from "../Model/MapModel/Data/Elements/Npc";
const { ccclass, property } = _decorator;

@ccclass("RewardDialog")
export class RewardDialog extends DialogBase {
    @property(Label)
    private content: Label = null!;
    @property(Node)
    private thanksNode: Node = null!;
    @property(Label)
    private thanksLabel: Label = null!;
    @property(Node)
    private bussinessNode: Node = null!;

    private callback: ((accept: boolean) => void) | null = null;
    private npc: Npc = null!;

    onOpen(userData: { element: Npc; callback: (accept: boolean) => void }) {
        this.npc = userData.element;
        this.content.string = this.npc.talk().talk;
        this.callback = userData.callback;
        this.thanksNode.active = this.npc.onceStep;
        this.bussinessNode.active = !this.npc.onceStep;
        this.thanksLabel.string = this.npc.npcInfo.type == 2 ? "谢谢" : "我太需要了";
    }

    onNextBtnClick() {
        this.callback && this.callback(false);
        this.close();
    }

    onAcceptBtnClick() {
        this.callback && this.callback(true);
        this.close();
    }
}
