import { _decorator, Label } from "cc";
import { BaseDialog } from "../../Framework/Base/BaseDialog";
const { ccclass, property } = _decorator;

@ccclass("ChatDialog")
export class ChatDialog extends BaseDialog {
    @property(Label)
    content: Label | null = null;
    private contentIndex: number = 0;
    private talkContent: string | string[] = null;
    private endCallback: () => void = null;
    // update (dt) {}
    init(content: string | string[], endCallback: () => void) {
        //this.talkContent = content;
        //this.endCallback = endCallback;
        //if (typeof content == "string") {
        //this.content.string = content;
        //} else {
        //this.content.string = content[this.contentIndex++];
        //}
    }
    protected close() {
        //if (typeof this.talkContent == "string" || this.contentIndex >= this.talkContent.length) {
        //this.endCallback && this.endCallback();
        //super.close();
        //} else {
        //this.content.string = this.talkContent[this.contentIndex++];
        //}
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import {BaseDialog} from "./BaseDialog";
//
// const { ccclass, property } = cc._decorator;
//
// @ccclass
// export class ChatDialog extends BaseDialog {
//     @property(cc.Label)
//     content: cc.Label = null;
//
//     private contentIndex: number = 0;
//
//     private talkContent: string | string[] = null;
//
//     private endCallback: () => void = null;
//
//     // update (dt) {}
//     init(content: string | string[], endCallback: () => void) {
//         this.talkContent = content;
//         this.endCallback = endCallback;
//         if (typeof content == "string") {
//             this.content.string = content;
//         } else {
//             this.content.string = content[this.contentIndex++];
//         }
//     }
//
//     protected close() {
//         if (typeof this.talkContent == "string" || this.contentIndex >= this.talkContent.length) {
//             this.endCallback && this.endCallback();
//             super.close();
//         } else {
//             this.content.string = this.talkContent[this.contentIndex++];
//         }
//     }
// }
