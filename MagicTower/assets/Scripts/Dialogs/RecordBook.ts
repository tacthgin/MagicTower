import { _decorator, PageView, Node, Label, find, instantiate } from "cc";
import { GameApp } from "../../GameFramework/Application/GameApp";
import { DialogBase } from "../../GameFramework/Application/UI/Dialog/DialogBase";
import { Utility } from "../../GameFramework/Scripts/Utility/Utility";
import { HeroModel } from "../Model/HeroModel/HeroModel";
import { NpcInfo } from "../Model/MapModel/Data/Elements/Npc";

const { ccclass, property } = _decorator;

@ccclass("RecordBook")
export class RecordBook extends DialogBase {
    @property(PageView)
    private pageView: PageView = null!;
    @property(Node)
    private content: Node = null!;
    @property(Node)
    private pageNode: Node = null!;
    @property(Label)
    private totalPage: Label = null!;
    @property(Label)
    private currentPage: Label = null!;

    onOpen() {
        let texts: any = [];
        let records = GameApp.getModel(HeroModel).getRecordTalk();
        records.forEach((record) => {
            let npc = Utility.Json.getJsonElement<NpcInfo>("npc", record.npcID)!;
            let talk = npc.talk[record.chatStep];
            if (typeof talk != "string") {
                talk.forEach((content: string) => {
                    texts.push(content);
                });
            } else {
                texts.push(talk);
            }
        });
        if (texts.length > 0) {
            find("Label", this.pageNode)!.getComponent(Label)!.string = texts[0];
            for (let i = 1; i < texts.length; i++) {
                let node = instantiate(this.pageNode);
                find("Label", node)!.getComponent(Label)!.string = texts[i];
                this.pageView.addPage(node);
            }
        } else {
            find("Label", this.pageNode)!.getComponent(Label)!.string = "";
        }
        this.setPageNum();
        this.totalPage.string = `共${texts.length}页`;
    }

    private onNextClick() {
        this.pageView.setCurrentPageIndex(this.pageView.getCurrentPageIndex() + 1);
        this.setPageNum();
    }

    private onPrevClick() {
        this.pageView.setCurrentPageIndex(this.pageView.getCurrentPageIndex() - 1);
        this.setPageNum();
    }

    private setPageNum() {
        this.currentPage.string = `第${this.pageView.getCurrentPageIndex() + 1}页`;
    }
}
