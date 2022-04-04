import { _decorator, Node, Button, UIOpacity } from "cc";
import { GameApp } from "../../GameFramework/Scripts/Application/GameApp";
import { DialogBase } from "../../GameFramework/Scripts/Application/UI/Dialog/DialogBase";
import { HeroAttr } from "../Model/HeroModel/HeroAttr";
import { HeroModel } from "../Model/HeroModel/HeroModel";
import { SaveModel } from "../Model/SaveModel/SaveModel";

const { ccclass, property } = _decorator;

@ccclass("ArchiveDialog")
export class ArchiveDialog extends DialogBase {
    @property(Node)
    private saveNodes: Node[] = null!;
    private saveModel: SaveModel = null!;

    onOpen() {
        this.saveModel = GameApp.getModel(SaveModel);
        this.selectSaveNode(this.saveModel.currentArchiveIndex);
    }

    private selectSaveNode(index: number) {
        for (let i = 0; i < this.saveNodes.length; i++) {
            this.saveNodes[i].getComponent(UIOpacity)!.opacity = i == index ? 255 : 150;
        }
    }

    private onSaveButtonClick(button: Button, customEventData: string) {
        switch (customEventData) {
            case "save":
                this.saveModel.saveArchive();
                break;
            default:
                let index = customEventData[customEventData.length - 1];
                if (this.saveModel.loadArchive(parseInt(index))) {
                    this.close();
                }
                break;
        }
    }

    private packageArchiveStr(): string {
        let heroModel = GameApp.getModel(HeroModel);
        return `存档${this.saveModel.currentArchiveIndex}:血量${heroModel.getAttr(HeroAttr.HP)}`;
    }
}
