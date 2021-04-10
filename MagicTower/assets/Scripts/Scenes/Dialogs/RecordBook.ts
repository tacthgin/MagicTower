import { _decorator, PageView, Node, Label } from "cc";
import { BaseDialog } from "../../Frame/Base/BaseDialog";

const { ccclass, property } = _decorator;

@ccclass("RecordBook")
export default class RecordBook extends BaseDialog {
    @property(PageView)
    pageView: PageView | null = null;
    @property(Node)
    content: Node | null = null;
    @property(Node)
    pageNode: Node | null = null;
    @property(Label)
    totalPage: Label | null = null;
    @property(Label)
    currentPage: Label | null = null;
    init() {
        //let texts = [];
        //let records = DataManager.getCustomData("GameInfo").HeroInfo.getRecordTalk();
        //records.forEach(record => {
        //let npc = DataManager.getJsonElement("npc", record.npcId);
        //texts.push(npc.talk[record.chatStep]);
        //});
        //if (texts.length > 0) {
        //cc.find("Label", this.pageNode).getComponent(cc.Label).string = texts[0];
        //for (let i = 1; i < texts.length; i++) {
        //let node = cc.instantiate(this.pageNode);
        //cc.find("Label", node).getComponent(cc.Label).string = texts[i];
        //this.pageView.addPage(node);
        //}
        //} else {
        //cc.find("Label", this.pageNode).getComponent(cc.Label).string = "";
        //}
        //this.setPageNum();
        //this.totalPage.string = `共${texts.length}页`;
    }
    onNextClick() {
        //this.pageView.setCurrentPageIndex(this.pageView.getCurrentPageIndex() + 1);
        //this.setPageNum();
    }
    onPrevClick() {
        //this.pageView.setCurrentPageIndex(this.pageView.getCurrentPageIndex() - 1);
        //this.setPageNum();
    }
    setPageNum() {
        //this.currentPage.string = `第${this.pageView.getCurrentPageIndex() + 1}页`;
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import {BaseDialog} from "./BaseDialog";
// import { DataManager } from "../../Managers/DataManager";
//
// const { ccclass, property } = cc._decorator;
//
// @ccclass
// export default class RecordBook extends BaseDialog {
//     @property(cc.PageView)
//     pageView: cc.PageView = null;
//
//     @property(cc.Node)
//     content: cc.Node = null;
//
//     @property(cc.Node)
//     pageNode: cc.Node = null;
//
//     @property(cc.Label)
//     totalPage: cc.Label = null;
//
//     @property(cc.Label)
//     currentPage: cc.Label = null;
//
//     init() {
//         let texts = [];
//
//         let records = DataManager.getCustomData("GameInfo").HeroInfo.getRecordTalk();
//         records.forEach(record => {
//             let npc = DataManager.getJsonElement("npc", record.npcId);
//             texts.push(npc.talk[record.chatStep]);
//         });
//
//         if (texts.length > 0) {
//             cc.find("Label", this.pageNode).getComponent(cc.Label).string = texts[0];
//             for (let i = 1; i < texts.length; i++) {
//                 let node = cc.instantiate(this.pageNode);
//                 cc.find("Label", node).getComponent(cc.Label).string = texts[i];
//                 this.pageView.addPage(node);
//             }
//         } else {
//             cc.find("Label", this.pageNode).getComponent(cc.Label).string = "";
//         }
//         this.setPageNum();
//         this.totalPage.string = `共${texts.length}页`;
//     }
//
//     onNextClick() {
//         this.pageView.setCurrentPageIndex(this.pageView.getCurrentPageIndex() + 1);
//         this.setPageNum();
//     }
//
//     onPrevClick() {
//         this.pageView.setCurrentPageIndex(this.pageView.getCurrentPageIndex() - 1);
//         this.setPageNum();
//     }
//
//     setPageNum() {
//         this.currentPage.string = `第${this.pageView.getCurrentPageIndex() + 1}页`;
//     }
// }
