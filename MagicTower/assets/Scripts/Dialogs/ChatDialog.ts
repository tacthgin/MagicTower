import { _decorator, Label } from "cc";
import { DialogBase } from "../../GameFramework/Scripts/Application/UI/Dialog/DialogBase";
const { ccclass, property } = _decorator;

@ccclass("ChatDialog")
export class ChatDialog extends DialogBase {
    @property(Label)
    private content: Label = null!;

    private contentIndex: number = 0;
    private talkContent: string | string[] = null!;
    private endCallback: Function | null = null;

    onOpen(userData: { content: string | string[]; endCallback: Function | null }) {
        this.talkContent = userData.content;
        this.endCallback = userData.endCallback;
        if (typeof this.talkContent == "string") {
            this.content.string = this.talkContent;
        } else {
            this.content.string = this.talkContent[this.contentIndex++];
        }
    }

    onCloseClick() {
        if (typeof this.talkContent == "string" || this.contentIndex >= this.talkContent.length) {
            this.endCallback && this.endCallback();
            super.close();
        } else {
            this.content.string = this.talkContent[this.contentIndex++];
        }
    }
}
